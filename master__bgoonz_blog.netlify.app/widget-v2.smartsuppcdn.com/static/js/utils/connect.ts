import {
	createVisitorClient,
	VisitorEvents,
	AccountStatus,
	SocketError,
	IVisitorIdentity,
	IMessage,
	MessageSubType,
	AgentEvents,
} from '@smartsupp/websocket-client'

import store from 'store'
import {
	MessageAction,
	addAgent,
	removeAgent,
	removeAllAgents,
	addMessageFromServer,
	checkMessagesAndMarkAsRead,
	assignAgent,
	unassignAgent,
} from 'store/messages/actions'
import { configLang } from 'store/translations/constants'
import { GeneralAction, toggleOpenCloseWidget } from 'store/general/actions'
import { isWidgetVisible, openWidgetOnTrigger } from 'store/general/selectors'
import { AgentActions, setStatus } from 'store/agent/actions'
import { ChatStatus, InitialChatStatus } from 'model/Enums'
import { mapAgentFromServerToLocal } from 'utils/messageHelpers'
import { handleError } from 'utils/errorHelpers'
import { getSsWidget } from 'utils/sdk'
import { botMessageSentGALogger, conversationServedGA, messageReceivedGaLogger } from 'utils/googleAnalytics'
import { filterConnectedAgents } from 'utils/agentHelpers'
import { getServerUrl } from 'utils/serverHelper'
import { setToStorage, getFromStorage } from 'utils/cookie'
import { apiVariables, emitter } from 'utils/apiHelper'
import { secretDebug } from 'utils/debug'
import { storageIdName, storageVisitsName, showWidgetButtonAnimationName } from 'constants/cookies'
import { EventsSupported } from 'constants/apiConstants'
import {
	FAKE_BOT_TYPING,
	AGENT_TYPING_TIMER,
	DISCONNECT_TIMER,
	GET_WIDGET_WIDTH_TIMER,
} from 'constants/timeoutConstants'
import { AccountEvent, AgentEvent, ChatEvent, GeneralEvent, VisitorEvent } from 'constants/EventsList'

const visitorData = getSsWidget().options.visitorData || {}
const numberOfVisits = getFromStorage(storageVisitsName) ? Number(getFromStorage(storageVisitsName)) : null

// eslint-disable-next-line
export const visitorClient = (function () {
	// eslint-disable-next-line
	let visitorClient = {
		client: {},
	} as any

	// Option for Dash, to get translates
	if (!getSsWidget().options.host) {
		return visitorClient
	}
	setTimeout(() => {
		visitorClient.client = createVisitorClient({
			data: {
				key: getSsWidget().options.key,
				userAgent: window.top.navigator.userAgent,
				id: getFromStorage(storageIdName) || null,
				group: apiVariables.group || visitorData.group,
				email: apiVariables.email || visitorData.email,
				lang: apiVariables.language || configLang.lang,
				pageUrl: window.top.location.href,
				pageTitle: window.top.document.title,
				visits: numberOfVisits || 0,
				variables: apiVariables.variables || visitorData.variables,
				name: apiVariables.name || visitorData.name,
				domain: window.location.hostname,
				phone: apiVariables.phone || visitorData.phone,
				referer: window.top.document.referrer,
				bundleVersion: process.env.REACT_APP_VERSION || 'dev',
				sitePlatform: getSsWidget().options.sitePlatform,
				triggerable: getSsWidget().options.triggerable,
				isWidgetVisible: isWidgetVisible(store.getState()),
				isPreviewMode: getSsWidget().options.isPreviewMode,
			},
			connection: {
				url: `${getServerUrl()}`,
				options: {
					path: '/socket',
					autoConnect: false,
					reconnection: true,
					reconnectionDelay: 1000,
					reconnectionDelayMax: 30000,
				},
			},
		})

		// eslint-disable-next-line
		// @ts-ignore
		if (getSsWidget().options.onClientCreated) {
			getSsWidget().options.onClientCreated(visitorClient.client)
		}

		visitorClient.client.on(AgentEvent.StatusUpdated, (data: VisitorEvents.IAgentStatusUpdated) => {
			store.dispatch(AgentActions.updateAgentStatus(data))
		})

		visitorClient.client.on(AgentEvent.Updated, (data: AgentEvents.IAgentUpdated) => {
			store.dispatch(AgentActions.updateAgent(data))
		})

		visitorClient.client.on(AgentEvent.Removed, (data: AgentEvents.IAgentDisconnected) => {
			// Complete agent removal
			store.dispatch(AgentActions.deleteAgent(data.id))
		})

		visitorClient.client.on(AccountEvent.Updated, (chatState: VisitorEvents.IAccountUpdated) => {
			store.dispatch(setStatus(chatState.status as AccountStatus))
			store.dispatch(GeneralAction.widgetOnline())
		})

		visitorClient.client.on(ChatEvent.AgentAssigned, (data: VisitorEvents.IChatAgentAssigned) => {
			store.dispatch(assignAgent(data))
		})

		visitorClient.client.on(ChatEvent.AgentUnassigned, (data: VisitorEvents.IChatAgentUnassigned) => {
			store.dispatch(unassignAgent(data))
		})

		visitorClient.client.on(ChatEvent.AgentTyping, (isTyping: VisitorEvents.IChatAgentTyping) => {
			// Is here becuase of Elastic search in the BE
			// without this new message would come a lot later after the typing indicator is hidden
			setTimeout(
				() => store.dispatch(AgentActions.setIsAgentTyping(isTyping.typing.is)),
				isTyping.typing.is ? 0 : AGENT_TYPING_TIMER,
			)
		})

		visitorClient.client.on(ChatEvent.AgentJoined, (data: VisitorEvents.IChatAgentJoined) => {
			store.dispatch(addAgent(data))
			conversationServedGA(data.agent.fullname)
		})

		visitorClient.client.on(ChatEvent.AgentLeft, (data: VisitorEvents.IChatAgentLeft) => {
			store.dispatch(removeAgent(data))
		})

		visitorClient.client.on(ChatEvent.ContactRead, (data: VisitorEvents.IChatRead) => {
			store.dispatch(MessageAction.setLastRead(data.lastReadAt))
			store.dispatch(GeneralAction.widgetOnline())
		})

		visitorClient.client.on(ChatEvent.MessageReceived, (message: any) => {
			store.dispatch(AgentActions.setIsAgentTyping(false))
			const receivedMessage: IMessage = message.message
			if (receivedMessage.subType !== MessageSubType.Contact) {
				store.dispatch(MessageAction.setIsFakeTyping(true))
			}

			setTimeout(() => {
				store.dispatch(
					addMessageFromServer({
						message: receivedMessage,
						agents: store.getState().agent.agents,
					}),
				)
				store.dispatch(MessageAction.setIsFakeTyping(false))
			}, FAKE_BOT_TYPING)

			store.dispatch(checkMessagesAndMarkAsRead())

			if (!store.getState().general.isWidgetOnline) {
				store.dispatch(GeneralAction.widgetOnline())
			}

			const messages = [...store.getState().messages.messages]

			if (receivedMessage.subType === MessageSubType.Bot) {
				store.dispatch(GeneralAction.setChatStatus(ChatStatus.Pending))
				store.dispatch(MessageAction.setBotName(receivedMessage.trigger?.name))
			}

			if (
				openWidgetOnTrigger(store.getState()) &&
				(receivedMessage.subType === MessageSubType.Bot || receivedMessage.subType === MessageSubType.Trigger)
			) {
				store.dispatch(toggleOpenCloseWidget(true))
			}

			messageReceivedGaLogger(messages, receivedMessage)
			botMessageSentGALogger(messages, receivedMessage)

			emitter.emit(EventsSupported.MessageReceived, receivedMessage)
		})

		visitorClient.client.on(ChatEvent.VisitorClosed, () => {
			store.dispatch(GeneralAction.setChatStatus(ChatStatus.ClosedByVisitor))
		})

		visitorClient.client.on(ChatEvent.Updated, () => {
			store.dispatch(GeneralAction.setChatStatus(ChatStatus.Served))
		})

		visitorClient.client.on(ChatEvent.Served, () => {
			store.dispatch(GeneralAction.setChatStatus(ChatStatus.Served))
		})

		visitorClient.client.on(ChatEvent.Opened, () => {
			store.dispatch(GeneralAction.setChatStatus(ChatStatus.Opened))
		})

		visitorClient.client.on(ChatEvent.Closed, (data: VisitorEvents.IChatClosed) => {
			if (data.closeType === 'agent_close') {
				store.dispatch(removeAllAgents(data))
				store.dispatch(GeneralAction.setChatStatus(ChatStatus.Resolved))
			}
		})

		visitorClient.client.on(ChatEvent.MessageUpdated, (data: VisitorEvents.IChatMessageUpdated) => {
			store.dispatch(MessageAction.hideChatbotMessageOptions(data.message.id))
		})

		visitorClient.client.on(VisitorEvent.Connect, () => {
			store.dispatch(GeneralAction.widgetOnline())
		})

		visitorClient.client.on(VisitorEvent.Connected, () => {
			secretDebug('visitor.connected listened')
			store.dispatch(GeneralAction.widgetOnline())
		})

		visitorClient.client.on(VisitorEvent.Updated, (userData: Partial<IVisitorIdentity>) => {
			store.dispatch(GeneralAction.updateUser(userData))
		})

		visitorClient.client.on(GeneralEvent.Initialized, () => {
			secretDebug('initialized in widget listened')
			setTimeout(() => {
				store.dispatch(GeneralAction.widgetOnline())
				secretDebug('initialized timeout ran')
			}, DISCONNECT_TIMER)
			getData()
			secretDebug('initialized listened and ran all the function inside itself')
		})

		visitorClient.client.on(GeneralEvent.Connect, () => {
			secretDebug('connect listened')
			store.dispatch(GeneralAction.widgetOnline())
		})

		visitorClient.client.on(GeneralEvent.Disconnect, () => {
			setTimeout(() => store.dispatch(GeneralAction.widgetOffline()), DISCONNECT_TIMER)
		})

		visitorClient.client.on(GeneralEvent.Error, (err: Error | SocketError) => {
			handleError('error.serverError', err)
		})

		const getData = async () => {
			try {
				const data = await visitorClient.client.connect()
				secretDebug('data', data)
				store.dispatch(GeneralAction.widgetOnline())
				// save user identity
				const { id } = visitorClient.client.identity!
				setToStorage(storageIdName, `${id || ''}`)
				setToStorage(storageVisitsName, `${data.visitor.visits}`)

				if (data) {
					store.dispatch(GeneralAction.setUser(data))
					store.dispatch(setStatus(data.account.status))
					store.dispatch(MessageAction.setAcceptedFileTypes(data.fileUpload.acceptedFileTypes))
					store.dispatch(MessageAction.setAcceptedFileExtensions(data.fileUpload.acceptedFileExtensions))
					store.dispatch(MessageAction.setAcceptedFileMaxSize(data.fileUpload.maxFileSize))

					if (data.chat) {
						store.dispatch(MessageAction.setLastRead(data.chat.unreadInfo.lastReadAt))
						if (data.chat.isClosed) {
							store.dispatch(GeneralAction.setChatStatus(ChatStatus.ClosedByVisitor))
						} else {
							switch (data.chat.status) {
								case InitialChatStatus.Closed: {
									store.dispatch(GeneralAction.setChatStatus(ChatStatus.Resolved))
									break
								}
								case InitialChatStatus.Open: {
									store.dispatch(GeneralAction.setChatStatus(ChatStatus.Opened))
									break
								}
								case InitialChatStatus.Served: {
									store.dispatch(GeneralAction.setChatStatus(ChatStatus.Served))
									break
								}
								case InitialChatStatus.Pending: {
									store.dispatch(GeneralAction.setChatStatus(ChatStatus.Pending))
									break
								}
								default:
									break
							}
						}
					}
				}

				const { agents } = data.account
				const mappedAgents = agents.map(mapAgentFromServerToLocal)
				store.dispatch(AgentActions.setAgents(mappedAgents))

				// Serves for setting connected agents
				const assignedIds = data.chat && data.chat.assignedIds
				const filteredAgents = filterConnectedAgents(assignedIds, agents)
				store.dispatch(AgentActions.setConnectedAgents(filteredAgents))

				if (data.chat && data.chat.messages && data.chat.messages.length) {
					store.dispatch(
						addMessageFromServer({
							message: data.chat.messages,
							agents: store.getState().agent.agents,
						}),
					)
				}
				store.dispatch(AgentActions.setAgents(mappedAgents))
				store.dispatch(setStatus(data.account.status))
				store.dispatch(GeneralAction.widgetOnline())
				setTimeout(() => store.dispatch(GeneralAction.widgetLoadedToggle()), GET_WIDGET_WIDTH_TIMER)
				setToStorage(showWidgetButtonAnimationName, 'false', false, true)
				store.dispatch(checkMessagesAndMarkAsRead())
			} catch (error) {
				store.dispatch(GeneralAction.widgetHide())
				handleError('error.serverError', error)
			}
		}

		getData()
	}, 0)

	return visitorClient
})()
