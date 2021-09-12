import { createSelector } from 'reselect'
import GlobToRegExp from 'glob-to-regexp'

import { MessageContent, MessageSubType } from '@smartsupp/websocket-client'

import { State } from 'store/combinedReducers'
import { getUnreadMessages } from 'store/messages/utils'
import {
	filterLatestTriggerMessages,
	filterUserAgentMessages,
	groupMessages,
	removeFormsWhenFilled,
	sortMessagesByDate,
} from 'utils/messageHelpers'
import { MessageTrigger } from 'model/Message'
import { FileUploadState, LoadingState, WarningBarState } from 'model/Enums'

export const getMessages = (state: State) => state.messages.messages
export const isTyping = (state: State) => state.agent.isTyping
export const showTriggerTypingAnimation = (state: State) => state.messages.fakeTyping
export const emojiPickerState = (state: State) => state.messages.emojiPickerState
export const inputText = (state: State) => state.messages.inputText
export const sendingMessageState = (state: State) => state.messages.messageSendingState
export const warningBarState = (state: State) => state.messages.warningBarState
export const fileUploadState = (state: State) => state.messages.fileUploadState
export const acceptedFileExtensions = (state: State) => state.messages.acceptedFileExtensions
export const acceptedFileMaxSize = (state: State) => state.messages.acceptedFileMaxSize
const acceptedFileTypes = (state: State) => state.messages.acceptedFileTypes
const lastReadAt = (state: State) => state.messages.lastReadAt
const isWidgetOpen = (state: State) => state.general.isWidgetOpen
const getMessageId = (state: State, messageId: string) => messageId

export const getAcceptedFileTypes = createSelector(acceptedFileTypes, state =>
	state.map(fileType => GlobToRegExp(fileType)),
)

export const isSendingBtnDisabled = createSelector(
	sendingMessageState,
	inputText,
	(state, text) => state === LoadingState.Loading || text.trim().length === 0,
)

export const showWarningBar = createSelector(
	warningBarState,
	state =>
		state === WarningBarState.NotAllowedAsFirstMessage ||
		state === WarningBarState.FileTooBig ||
		state === WarningBarState.TooManyFiles ||
		state === WarningBarState.FilesWerentProcessed ||
		state === WarningBarState.BadExtension ||
		state === WarningBarState.SameMessageTwice,
)

export const showFileUploadState = createSelector(
	fileUploadState,
	state => state === FileUploadState.Loading || state === FileUploadState.Initial,
)

export const messagesWithPosition = createSelector(getMessages, messages => {
	const messagesSortedByDate = sortMessagesByDate(messages)
	const filteredFromEmptyForms = removeFormsWhenFilled(messagesSortedByDate)

	return groupMessages(filteredFromEmptyForms).map(filteredMessage => ({
		...messages.find(message => message.id === filteredMessage.id)!,
		position: filteredMessage.position,
	}))
})

export const unreadMessagesCount = createSelector(
	messagesWithPosition,
	lastReadAt,
	isWidgetOpen,
	(messages, lastReadTime, isOpen) => {
		if (isOpen) return 0

		const unreadMessages = getUnreadMessages(messages, lastReadTime)

		return unreadMessages.length
	},
)

export const lastUnreadTriggers = createSelector(messagesWithPosition, lastReadAt, (messages, unreadTime) => {
	if (unreadTime) {
		const filtered = messages.filter(i => i.author !== MessageSubType.Contact && i.created > new Date(unreadTime))
		return filterLatestTriggerMessages(filtered)
	}
	return filterLatestTriggerMessages(messages)
})

export const lastUnreadTriggerMessage = createSelector(lastUnreadTriggers, trig => (trig[0] as MessageTrigger) || null)

export const fileUploadDisabled = createSelector(getMessages, items => filterUserAgentMessages(items).length === 0)

export const makeGetMessageById = () =>
	createSelector([messagesWithPosition, getMessageId], (messages, messageId) =>
		messages.find(message => message.id === messageId),
	)

export const getLastMessage = createSelector(messagesWithPosition, messages => {
	if (messages?.length < 1) return null
	return messages[messages.length - 1]
})

export const getLastMessageId = createSelector(getLastMessage, lastMessage => {
	if (!lastMessage) return null
	return lastMessage.id
})

export const isLastMessageRating = createSelector(getLastMessage, lastMessage => {
	if (!lastMessage) return false
	return lastMessage.type === MessageContent.Type.RateForm
})
