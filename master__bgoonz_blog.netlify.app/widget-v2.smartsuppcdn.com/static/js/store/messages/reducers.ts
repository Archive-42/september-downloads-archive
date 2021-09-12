import { reducer } from 'ts-action'
import { on } from 'ts-action-immer'
import { v4 } from 'uuid'
import { MessageSubType, MessageContent } from '@smartsupp/websocket-client'

import { MessageAction } from 'store/messages/actions'
import {
	MessageForm,
	AgentActivity,
	FormActionType,
	Message,
	MessageFile,
	AgentActivityType,
	MessageRating,
} from 'model/Message'
import { FormInputType } from 'model/FormInput'
import { WarningBarState, LoadingState, FileUploadState } from 'model/Enums'
import { visitorClient } from 'utils/connect'
import { getInitSoundsState } from 'utils/localStorageHelper'
import { getFromStorage } from 'utils/cookie'
import { mapMessageFromServerToLocal } from 'utils/messageHelpers'
import { TranslationService as T } from 'utils/TranslationService'
import { feedbackSentGA } from 'utils/googleAnalytics/googleAnalyticsEvents'
import { createRatingFormMessage } from 'data-sets/ratingMessage'
import { storageTextName } from 'constants/cookies'
import { enableSoundsStorageName } from 'constants/localStorage'

export const initialState = {
	currentTriggerMessageId: undefined as string | undefined,
	messages: [] as Message[],
	enableSounds: getInitSoundsState(),
	emojiPickerState: false,
	inputText: getFromStorage(storageTextName) || '',
	isTyping: false,
	fakeTyping: false,
	warningBarState: WarningBarState.Initial,
	fileUploadState: FileUploadState.Initial,
	lastReadAt: null as string | null,
	messageSendingState: LoadingState.Initial as LoadingState,
	acceptedFileTypes: [] as string[],
	acceptedFileExtensions: [] as string[],
	acceptedFileMaxSize: 0,
	currentBotName: undefined as string | undefined,
}

export type MessagesState = typeof initialState

export const messagesReducer = reducer<MessagesState>(
	initialState,
	on(MessageAction.setEnableSoundsState, (state: MessagesState, _) => {
		localStorage.setItem(enableSoundsStorageName, `${!state.enableSounds}`)
		state.enableSounds = !state.enableSounds
	}),
	on(MessageAction.finishTranscript, (state: MessagesState, { payload }) => {
		state.messages.push({
			type: MessageContent.Type.Text,
			author: MessageSubType.System,
			created: new Date(),
			agentId: null,
			id: v4(),
			text: T.translate('emailTranscript.positiveFeedback').replace('$$', payload),
		})
	}),
	on(MessageAction.setInputValue, (state: MessagesState, { payload }) => {
		const { value, messageId, name } = payload

		const selectedMessage = state.messages.find(
			m =>
				m.id === messageId && (m.type === MessageContent.Type.QuestionForm || m.type === MessageContent.Type.RateForm),
		) as MessageForm | undefined

		if (!selectedMessage) {
			console.error(
				"'MessageAction.setInputValue' called with wrong message ID, please check the code that called this",
			)
			return
		}

		const input = selectedMessage.inputs.find(i => i.name === name)

		if (!input) {
			console.error("'MessageAction.setInputValue' called with wrong input ID, please check the code that called this")
			return
		}

		input.value = value
	}),
	on(MessageAction.updateRatingMessage, (state: MessagesState, { payload }) => {
		const { rating, messageId, text, inputName } = payload

		const selectedMessage = state.messages.find(m => m.id === messageId && m.type === MessageContent.Type.RateForm) as
			| MessageRating
			| undefined

		if (!selectedMessage) {
			console.error(
				"'MessageAction.updateRatingMessage' called with wrong message ID, please check the code that called this",
			)
			return
		}

		const input = selectedMessage.inputs.find(i => i.name === inputName)

		if (!input) {
			console.error(
				"'MessageAction.updateRatingMessage' called with wrong input ID, please check the code that called this",
			)
			return
		}

		input.value = text || ''
		selectedMessage.finishedRatingText = text
		selectedMessage.finished = !!text
		selectedMessage.rating = rating
		feedbackSentGA(rating)
	}),

	on(MessageAction.submitForm, (state: MessagesState, { payload }) => {
		const selectedMessage = state.messages.find(
			m => m.id === payload && (m.type === MessageContent.Type.QuestionForm || m.type === MessageContent.Type.RateForm),
		) as MessageForm | MessageRating | undefined

		if (!selectedMessage) {
			console.error("'MessageAction.submitForm' called with wrong message ID, please check the code that called this")
			return
		}

		if (selectedMessage.type === MessageContent.Type.QuestionForm) {
			selectedMessage.finished = true
			selectedMessage.author = MessageSubType.Contact
		}
	}),
	on(MessageAction.addMessageFromServer, (state: MessagesState, { payload }) => {
		const { message } = payload
		if (Array.isArray(message)) {
			const mappedMessages = message.map(m => mapMessageFromServerToLocal(m)).filter(m => m !== undefined) as Message[]
			state.messages = [...mappedMessages]
			return
		}
		const mappedMessage = mapMessageFromServerToLocal(message)
		if (mappedMessage) {
			state.messages.push(mappedMessage)
		}
	}),
	on(MessageAction.markAllAsRead, (state: MessagesState, _) => {
		const numberMess = state.messages.length

		if (numberMess > 0) {
			visitorClient.client.chatRead()
		}

		state.lastReadAt = new Date().toISOString()
	}),
	on(MessageAction.setEmojiPickerState, (state: MessagesState, { payload }) => {
		state.emojiPickerState = payload
	}),
	on(MessageAction.setWarningBarState, (state: MessagesState, { payload }) => {
		state.warningBarState = payload
	}),
	on(MessageAction.setFileUploadState, (state: MessagesState, { payload }) => {
		state.fileUploadState = payload
	}),
	on(MessageAction.setIsTyping, (state: MessagesState, { payload }) => {
		state.isTyping = payload
	}),
	on(MessageAction.setIsFakeTyping, (state: MessagesState, { payload }) => {
		state.fakeTyping = payload
	}),
	on(MessageAction.addImageMessage, (state: MessagesState, { payload }) => {
		const newImageMessage: MessageFile = {
			author: MessageSubType.Contact,
			created: new Date(),
			id: v4(),
			type: MessageContent.Type.Upload,
			url: payload.url,
			name: payload.name,
			fileType: payload.type,
			uploadedWithError: payload.uploadedWithError,
			isImage: payload.isImage,
			thumb400: {
				url: payload.url400,
			},
		}
		state.messages.push(newImageMessage)
	}),
	on(MessageAction.addRatingForm, (state: MessagesState, { payload }) => {
		state.messages.push(createRatingFormMessage(payload, false))
	}),
	on(MessageAction.setFormLoadingState, (state: MessagesState, { payload }) => {
		const { messageId, loadingState } = payload
		const selectedMessage = state.messages.find(
			m => m.id === messageId && m.type === MessageContent.Type.QuestionForm,
		) as MessageForm | undefined

		if (!selectedMessage) {
			console.error(
				"'MessageAction.setFormLoadingState' called with wrong message ID, please check the code that called this",
			)
			return
		}

		selectedMessage.formSendingState = loadingState
	}),
	on(MessageAction.addAgentActivity, (state: MessagesState, { payload }) => {
		const agentJoin: AgentActivity = {
			agentStatus: payload.content.type,
			author: payload.subType,
			created: new Date(payload.createdAt),
			agentId: payload.agentId || null,
			id: payload.id,
			type: payload.content.type as AgentActivityType,
		}

		state.messages.push(agentJoin)
	}),
	on(MessageAction.addSendTranscript, (state: MessagesState, _) => {
		const agentJoin: MessageForm = {
			actionType: FormActionType.SendTranscript,
			author: MessageSubType.System,
			created: new Date(),
			id: v4(),
			type: MessageContent.Type.QuestionForm,
			finished: false,
			text: T.translate('emailTranscript.sendCopy'),
			inputs: [
				{
					type: FormInputType.Text,
					label: T.translate('emailTranscript.sendCopy'),
					name: 'email',
					placeHolder: 'email@address.com',
					validations: ['required', 'isEmail'],
					multiline: false,
					fullWidth: false,
					value: '',
				},
			],
		}

		state.messages.push(agentJoin)
	}),
	on(MessageAction.setInputText, (state: MessagesState, { payload }) => {
		state.inputText = payload
	}),
	on(MessageAction.hideChatbotMessageOptions, (state: MessagesState, { payload }) => {
		const messageWithOptions = state.messages.find(message => message.id === payload)
		if (messageWithOptions) {
			const idx = state.messages.indexOf(messageWithOptions)
			const newChosen = { ...messageWithOptions, showReplies: false }
			state.messages[idx] = newChosen
		}
	}),
	on(MessageAction.setLastRead, (state: MessagesState, { payload }) => {
		state.lastReadAt = payload
	}),
	on(MessageAction.setMessageSendingState, (state: MessagesState, { payload }) => {
		state.messageSendingState = payload
	}),
	on(MessageAction.setAcceptedFileTypes, (state: MessagesState, { payload }) => {
		state.acceptedFileTypes = payload
	}),
	on(MessageAction.setAcceptedFileExtensions, (state: MessagesState, { payload }) => {
		state.acceptedFileExtensions = payload
	}),
	on(MessageAction.setAcceptedFileMaxSize, (state: MessagesState, { payload }) => {
		state.acceptedFileMaxSize = payload
	}),
	on(MessageAction.setBotName, (state: MessagesState, { payload }) => {
		state.currentBotName = payload
	}),
)
