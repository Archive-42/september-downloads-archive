import axios from 'axios'
import { action, payload } from 'ts-action'
import { Dispatch, Action } from 'redux'
import * as Sentry from '@sentry/browser'
import {
	IMessage,
	MessageSubType,
	MessageContent,
	VisitorEvents,
	MessageEventContent,
	MessageEventGeneric,
	AccountStatus,
} from '@smartsupp/websocket-client'
import debounce from 'lodash/debounce'

import store from 'store'
import { State } from 'store/combinedReducers'
import { generalSelectors } from 'store/general'
import { GeneralAction } from 'store/general/actions'
import { AgentActions } from 'store/agent/actions'
import { agentsSelectors } from 'store/agent'
import { AuthenticationData } from 'store/messages/types'

import { promiseTimeout } from 'utils/promiseWithTimeout'
import { LoadingState, AgentRating, WarningBarState, FileUploadState, ChatStatus } from 'model/Enums'
import { MessageForm, FormActionType, MessageRating } from 'model/Message'
import { Agent } from 'model/Agent'
import { Rating } from 'model/Rating'

import { emitter } from 'utils/apiHelper'
import { generateAuthFormInputs } from 'utils/authFormHelper'
import { visitorClient } from 'utils/connect'
import { handleError } from 'utils/errorHelpers'
import { getSsWidget } from 'utils/sdk'
import {
	getValuesFromForm,
	replaceEmojisInText,
	userSentSameMessageTwiceInRow,
	sortMessagesByDate,
	playSound,
} from 'utils/messageHelpers'
import { secretDebug } from 'utils/debug'

import { EventsSupported } from 'constants/apiConstants'
import { WARNING_BAR_TIMER } from 'constants/errorConstants'
import { AUTH_FORM_MESSAGE_SEND_DELAY } from 'constants/messageListConstants'
import { IS_TYPING_DEBOUNCE_TIME, SENDING_MESSAGE_MAX_TIMEOUT } from 'constants/formConstants'
import { authFormFilledGA, chatbotButtonInteractionGA, offlineMessageSentGaLogger } from 'utils/googleAnalytics'

import { AppThunkAction } from 'types'

export const MessageAction = {
	addRatingForm: action('messages/ADD_RATING_FORM', payload<Rating>()),
	setInputValue: action('messages/SET_INPUT_VALUE', payload<{ messageId: string; name: string; value: string }>()),
	setLoadingState: action('messages/SET_LOADING_STATE', payload<LoadingState>()), // TODO remove
	setEmojiPickerState: action('messages/SET_EMOJI_PICKER_STATE', payload<boolean>()),
	setIsTyping: action('messages/SET_IS_TYPING', payload<boolean>()),
	setIsFakeTyping: action('messages/SET_IS_FAKE_TYPING', payload<boolean>()),
	updateRatingMessage: action(
		'messages/UPDATE_RATING_MESSAGE',
		payload<{ messageId: string; rating: AgentRating; inputName: string; text?: string | undefined }>(),
	),
	addMessageFromServer: action(
		'messages/ADD_MESSAGE_FROM_SERVER',
		payload<{
			message: IMessage | IMessage[]
			agents: Agent[]
		}>(),
	),
	submitForm: action('messages/SUBMIT_FORM', payload<string>()),
	setFormLoadingState: action(
		'messages/SET_FORM_LOADING_STATE',
		payload<{ messageId: string; loadingState: LoadingState }>(),
	),
	addAgentActivity: action(
		'messages/ADD_AGENT_ACTIVITY',
		payload<MessageEventGeneric<MessageSubType.System, MessageEventContent.Content>>(),
	),
	setEnableSoundsState: action('general/SET_SOUNDS_ALLOWED_STATE', payload<boolean>()),
	finishTranscript: action('messages/FINISH_TRANSCRIPT', payload<string>()),
	markAllAsRead: action('messages/MARK_ALL_AS_READ'),
	addSendTranscript: action('messages/ADD_SEND_TRANSCRIPT'),
	addImageMessage: action(
		'messages/ADD_IMAGE_MESSAGE',
		payload<{
			url: string
			name: string
			type: string
			uploadedWithError: boolean
			isImage: boolean
			url400: string | undefined
		}>(),
	),
	hideChatbotMessageOptions: action('messages/HIDE_CHATBOT_MESSAGE_OPTIONS', payload<string>()),
	setInputText: action('messages/SET_INPUT_TEXT', payload<string>()),
	setWarningBarState: action('messages/SET_WARNING_BAR_STATE', payload<WarningBarState>()),
	setFileUploadState: action('messages/SET_FILE_UPLOAD_STATE', payload<FileUploadState>()),
	setLastRead: action('messages/SET_UNREAD_INFO', payload<string | null>()),
	setMessageSendingState: action('messages/SET_SENDING_STATE', payload<LoadingState>()),
	setAcceptedFileTypes: action('messages/SET_ACCEPTED_FILE_TYPES', payload<string[]>()),
	setAcceptedFileExtensions: action('messages/SET_ACCEPTED_FILE_EXTENSIONS', payload<string[]>()),
	setAcceptedFileMaxSize: action('messages/SET_ACCEPTED_FILE_MAX_SIZE', payload<number>()),
	createBotResponse: action('messages/CREATE_BOT_RESPONSE', payload<string>()),
	setBotName: action('messages/SET_BOT_NAME', payload<string | undefined>()),
}

export const addAgent: AppThunkAction<MessageAction> =
	(agent: VisitorEvents.IChatAgentJoined) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		const stateAgents = getState().agent.agents
		dispatch(AgentActions.addConnectedAgent(agent && agent.agent))
		dispatch(addMessageFromServer({ message: agent.message, agents: stateAgents }))
		setTimeout(() => dispatch(checkMessagesAndMarkAsRead()), 0)
	}

export const assignAgent: AppThunkAction<MessageAction> =
	(agent: VisitorEvents.IChatAgentAssigned) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		dispatch(AgentActions.addConnectedAgentFromTransfer(agent))
		const stateAgents = getState().agent.agents
		dispatch(addMessageFromServer({ message: agent.message, agents: stateAgents }))
	}

// Is here separate because it kept loosing reference and during intensive typing is sent typing:false because debounce lost reference
// Tried multiple things including useCallback in ChatInput component, but the reference was still being lost
// IMPORTANT NOTE do not modify dispatch in this function as it would break the actions
// Solution was approved by stack overflow: https://stackoverflow.com/questions/50493683/debounce-method-inside-redux-thunk
const debounceStopTyping = debounce((dispatch: Dispatch<Action>) => {
	visitorClient.client.chatTyping(false)
	dispatch(MessageAction.setIsTyping(false))
}, IS_TYPING_DEBOUNCE_TIME)

export const setIsTyping: AppThunkAction<MessageAction> =
	() =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		const { messages } = getState()
		const isUserTyping = messages.isTyping

		if (!isUserTyping) {
			dispatch(MessageAction.setIsTyping(true))
			visitorClient.client.chatTyping(true)
		}

		debounceStopTyping(dispatch)
	}

export const addSendTranscript: AppThunkAction<MessageAction> =
	() =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		dispatch(MessageAction.addSendTranscript())
		setTimeout(() => dispatch(checkMessagesAndMarkAsRead()), 0)
	}

export const checkMessagesAndMarkAsRead: AppThunkAction<MessageAction> =
	(bypassClosedWidget?: boolean) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		const { messages, general } = getState()
		const { lastReadAt } = messages
		const { isWidgetOpen } = general
		const mess = messages.messages
		const nonContactMessages = mess.filter(m => m.author !== MessageSubType.Contact)
		const sortedMess = sortMessagesByDate(nonContactMessages)
		const lastReadSortedMess = sortedMess.length > 0 ? sortedMess[sortedMess.length - 1].created : undefined

		if (bypassClosedWidget) {
			dispatch(MessageAction.markAllAsRead())
		}

		if (isWidgetOpen) {
			const lastReadMessKnownByBE = lastReadAt ? new Date(lastReadAt) : lastReadSortedMess
			if (
				lastReadSortedMess &&
				lastReadMessKnownByBE &&
				lastReadSortedMess.getTime() >= lastReadMessKnownByBE.getTime() &&
				!document.hidden
			) {
				dispatch(MessageAction.markAllAsRead())
			}
		}
	}

export const setRating: AppThunkAction<MessageAction> =
	(messageId: string, rating: Rating) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		let selectedMessage = getState().messages.messages.find(
			m => m.id === messageId && m.type === MessageContent.Type.RateForm,
		) as MessageRating | undefined

		if (!selectedMessage) {
			console.error("'MessageAction.submitForm' called with wrong message ID, please check the code that called this")
			return
		}
		selectedMessage = { ...selectedMessage, rating: rating.type }

		dispatch(
			MessageAction.updateRatingMessage({
				messageId,
				inputName: 'rating',
				rating: rating.type!,
			}),
		)

		sendRating(selectedMessage, () => {
			dispatch(MessageAction.submitForm(messageId))
			setTimeout(() => dispatch(checkMessagesAndMarkAsRead()), 0)
		})
	}

export const removeAgent: AppThunkAction<MessageAction> =
	(
		agent: VisitorEvents.IChatAgentJoined | VisitorEvents.IChatAgentLeft | VisitorEvents.IChatClosed,
		calledFromTransfer = false,
	) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		if (getState().agent.connectedAgents.length <= 1 && calledFromTransfer === false) {
			if (getSsWidget().options?.ratingEnabled && generalSelectors.chatStatus(getState()) === ChatStatus.Served) {
				dispatch(addRating())
			}
		}
		const stateAgents = getState().agent.agents
		dispatch(addMessageFromServer({ message: agent.message, agents: stateAgents }))

		const { agentId } = agent.message.content.data
		if (agentId) {
			dispatch(AgentActions.removeConnectedAgent(agentId))
		}
	}

export const unassignAgent: AppThunkAction<MessageAction> =
	(agent: VisitorEvents.IChatAgentUnassigned) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		const stateAgents = getState().agent.agents
		dispatch(addMessageFromServer({ message: agent.message, agents: stateAgents }))
		dispatch(AgentActions.removeConnectedAgentFromTransfer(agent))
	}

export const removeAllAgents: AppThunkAction<MessageAction> =
	(agent: VisitorEvents.IChatClosed) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		if (getSsWidget().options?.ratingEnabled && generalSelectors.chatStatus(getState()) === ChatStatus.Served) {
			dispatch(addRating())
			dispatch(GeneralAction.setChatStatus(ChatStatus.Resolved))
		}
		const stateAgents = getState().agent.agents
		dispatch(addMessageFromServer({ message: agent.message, agents: stateAgents }))
		dispatch(AgentActions.removeAllConnectedAgents())
	}

export const addRating: AppThunkAction<MessageAction> =
	() =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		try {
			const rateInit = await visitorClient.client.chatRateInit()
			const stateAgents = getState().agent.agents
			dispatch(addMessageFromServer({ message: rateInit.message, agents: stateAgents }))
		} catch (error) {
			console.error(error)
		}
	}

export const createBotResponse: AppThunkAction<MessageAction> =
	(text: string, payload: Record<string, unknown>, messageId: string) => async (): Promise<void> => {
		const replacedEmojisText = replaceEmojisInText(text)
		chatbotButtonInteractionGA(text)

		const sendMessage = () =>
			new Promise((resolve, reject) => {
				resolve(
					visitorClient.client.chatMessage({
						content: {
							type: MessageContent.Type.Text,
							text: replacedEmojisText,
						},
						quickReply: { replyTo: messageId, payload },
					}),
				)
			})

		promiseTimeout(SENDING_MESSAGE_MAX_TIMEOUT, sendMessage())
	}

export const createMessage: AppThunkAction<MessageAction> =
	(text: string, doCheck = true) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		const messageState = getState().messages
		const generalState = getState().general
		const { messages } = messageState
		const agentState = getState().agent
		const { status } = agentState

		dispatch(MessageAction.setMessageSendingState(LoadingState.Loading))
		const isUserAuthed = generalSelectors.isUserAuthenticated(getState()) || false
		// todo vyladit , mozna dat do let generatedInputs

		const generatedInputs = generateAuthFormInputs(
			generalState.userData?.account.groups,
			generalState.userData?.visitor,
		)

		dispatch(GeneralAction.createAuthFormInputs(generatedInputs))

		if (
			(doCheck && status === AccountStatus.Offline && !isUserAuthed && generatedInputs.length > 0) ||
			(getSsWidget().options.requireLogin && !isUserAuthed && generatedInputs.length > 0)
		) {
			dispatch(GeneralAction.authFormStateToggle())
			dispatch(MessageAction.setMessageSendingState(LoadingState.Initial))
			return
		}

		// Forbid sending the same message two times in a row
		if (userSentSameMessageTwiceInRow(messages, text)) {
			dispatch(setWarningBar(WarningBarState.SameMessageTwice))
			dispatch(MessageAction.setMessageSendingState(LoadingState.Initial))
			return
		}

		const replacedEmojisText = replaceEmojisInText(text)
		const isWidgetOffline = agentsSelectors.status(getState()) === AccountStatus.Offline

		try {
			dispatch(MessageAction.setInputText(''))

			const sendMessage = () =>
				new Promise((resolve, reject) => {
					resolve(
						visitorClient.client.chatMessage({
							isOffline: isWidgetOffline,
							content: {
								type: MessageContent.Type.Text,
								text: replacedEmojisText,
							},
						}),
					)
				})

			// Get the message from server
			const getMessage = promiseTimeout(SENDING_MESSAGE_MAX_TIMEOUT, sendMessage())

			// Wait for the promise to get resolved
			getMessage.then(response => {
				emitter.emit(EventsSupported.MessageSent, response)
			})

			// Wait for the promise to get rejected or timed out
			getMessage.catch(error => {
				dispatch(MessageAction.setMessageSendingState(LoadingState.Initial))
				handleError('error.sendingMessageTooLong', error)
			})

			offlineMessageSentGaLogger(status)
			dispatch(MessageAction.setMessageSendingState(LoadingState.Success))
		} catch (err) {
			dispatch(MessageAction.setMessageSendingState(LoadingState.Failure))
			handleError('error.sendingMessage', err)
		}
	}

const sendRating = async (message: MessageRating, callback: () => void) => {
	try {
		await visitorClient.client.chatRate({
			messageId: message.id,
			text: message.inputs[0].value ? message.inputs[0].value.toString() : undefined,
			value: message.rating,
		})
		callback()
	} catch (err) {
		handleError('error.sendingRating', err)
	}
}

const sendTranscript = async (email: string, lang: string, callback: () => void) => {
	try {
		await visitorClient.client.chatTranscript(email, lang)
		callback()
	} catch (err) {
		handleError('error.sendingTranscript', err)
	}
}

export const uploadFile: AppThunkAction<MessageAction> =
	(file: File) =>
	async (dispatch: Dispatch<Action>): Promise<void> => {
		try {
			dispatch(MessageAction.setFileUploadState(FileUploadState.Loading))
			const data = await visitorClient.client.chatUploadInit()

			const upload = new FormData()
			upload.append('file', file, file.name)

			await axios.post(data.url, upload, {
				headers: {
					'content-type': 'multipart/form-data',
				},
				maxContentLength: Infinity,
			})

			await visitorClient.client.chatUploadFinish(data.token)

			dispatch(MessageAction.setFileUploadState(FileUploadState.Initial))
		} catch (err) {
			dispatch(MessageAction.setWarningBarState(WarningBarState.Failure))
			handleError('error.uploadingImage', err)
		}
	}

export const submitForm: AppThunkAction<MessageAction> =
	(messageId: string) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		const selectedMessage = getState().messages.messages.find(
			m =>
				m.id === messageId && (m.type === MessageContent.Type.QuestionForm || m.type === MessageContent.Type.RateForm),
		) as MessageForm | MessageRating | undefined

		if (!selectedMessage) {
			console.error("'MessageAction.submitForm' called with wrong message ID, please check the code that called this")
			return
		}

		// special action for the rating form
		if (selectedMessage.type === MessageContent.Type.RateForm) {
			dispatch(
				MessageAction.updateRatingMessage({
					messageId,
					inputName: 'rating',
					rating: selectedMessage.rating!,
					text: selectedMessage.inputs[0].value.toString() || '',
				}),
			)
			sendRating(selectedMessage, () => {
				dispatch(MessageAction.submitForm(messageId))
				setTimeout(() => dispatch(checkMessagesAndMarkAsRead()), 0)
			})
			return
		}

		// special action for the send transcript form
		if (
			selectedMessage.type === MessageContent.Type.QuestionForm &&
			selectedMessage.actionType === FormActionType.SendTranscript
		) {
			const email = selectedMessage.inputs[0].value!.toString()
			sendTranscript(email, getSsWidget().options.lang, () => {
				dispatch(MessageAction.finishTranscript(email))
				dispatch(MessageAction.submitForm(messageId))
				setTimeout(() => dispatch(checkMessagesAndMarkAsRead()), 0)
			})
			return
		}

		dispatch(MessageAction.submitForm(messageId))
	}

export const submitAuthForm: AppThunkAction<MessageAction> =
	(message: string) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		const { general } = getState()
		const filledInputs = getValuesFromForm(general.authFormInputs)
		const { userData } = general
		const visitor = userData?.visitor
		const { privacyNoticeCheckRequired } = getSsWidget().options

		const userEmailFromVisitorApi = visitor?.email
		const userNameFromVisitorApi = visitor?.name
		const userGroupFromVisitorApi = visitor?.group
		const userPhoneFromVisitorApi = visitor?.phone

		const authenticationData: AuthenticationData = {
			...((Boolean(userEmailFromVisitorApi) || Boolean(filledInputs.email)) && {
				email: userEmailFromVisitorApi || filledInputs.email,
			}),
			...((Boolean(userNameFromVisitorApi) || Boolean(filledInputs.name)) && {
				name: userNameFromVisitorApi || filledInputs.name,
			}),
			...((Boolean(filledInputs.group) || Boolean(userGroupFromVisitorApi)) && {
				group: filledInputs.group || userGroupFromVisitorApi,
			}),
			...((Boolean(userPhoneFromVisitorApi) || Boolean(filledInputs.phone)) && {
				phone: userPhoneFromVisitorApi || filledInputs.phone,
			}),
			...(Boolean(filledInputs.personalDataProcessingConsent) &&
				privacyNoticeCheckRequired && {
					personalDataProcessingConsent: filledInputs.personalDataProcessingConsent,
				}),
		}

		try {
			secretDebug('visitorClient.client.authenticate', visitorClient.client.authenticate, authenticationData)
			visitorClient.client.authenticate(authenticationData).then(() => {
				// After the request is send, only then send this message,
				//  because if the message came as first to BE, the choice of group would no be possible
				setTimeout(() => dispatch(createMessage(message, false)), AUTH_FORM_MESSAGE_SEND_DELAY)
				dispatch(GeneralAction.authFormStateToggle())
			})
			authFormFilledGA()
		} catch (e) {
			console.error('authentication fail', e)
			Sentry.withScope(scope => {
				Sentry.captureException({
					name: 'authentication fail',
					error: e,
				})
			})
		}
	}

export const addMessageFromServer: AppThunkAction<MessageAction> =
	(data: { message: IMessage | IMessage[]; agents: Agent[] }) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		dispatch(MessageAction.addMessageFromServer(data))
		const { message } = data
		if (generalSelectors.shouldPlaySound(getState()) && !Array.isArray(message)) {
			playSound(message.subType, message.type)
		}
	}

// Helper for showing warning bar
let timer: ReturnType<typeof setTimeout>
export const setWarningBar: AppThunkAction<MessageAction> =
	(state: WarningBarState) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		clearTimeout(timer)
		dispatch(MessageAction.setWarningBarState(state))
		timer = setTimeout(() => dispatch(MessageAction.setWarningBarState(WarningBarState.Initial)), WARNING_BAR_TIMER)
	}

document.addEventListener('visibilitychange', () => {
	const { isWidgetOnline } = store.getState().general

	const { isWidgetOpen } = store.getState().general
	const { messages } = store.getState().messages

	const messagesSent = messages.length > 0

	if (isWidgetOpen && !document.hidden && messagesSent) {
		visitorClient.client.chatRead()
	}

	secretDebug('event listener visibilty', 'isWidgetOnline', isWidgetOnline)

	if (!isWidgetOnline && !document.hidden) {
		secretDebug('reconnecting...')
		// TODO attemps limiter
		visitorClient.client.connect()
	}
})

export type MessageAction = typeof MessageAction
