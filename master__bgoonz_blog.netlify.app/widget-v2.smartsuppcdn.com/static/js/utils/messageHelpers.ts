import { differenceInSeconds } from 'date-fns'
import {
	Agent as IAgent,
	IMessage,
	MessageBot,
	MessageContent,
	MessageEventContent,
	MessageSubType,
	SimpleAgent as ISimpleAgent,
} from '@smartsupp/websocket-client'
import { TranslationService as T } from '../utils/TranslationService'
import {
	AgentActivity,
	FileUploadType,
	FilledMessage,
	Message,
	MessageBase,
	MessageFile,
	MessagePosition,
	MessageRating,
	MessageText,
	MessageTextBot,
	MessageTrigger,
	MessageType,
} from '../model/Message'
import { ASSETS_BASE_URL, AVATAR_SIZE_SUFFIX } from '../constants/apiConstants'
import { Agent } from '../model/Agent'
import { storageOpenName, storageTextName } from '../constants/cookies'
import { FormInput, FormInputType } from '../model/FormInput'
import { EmojiConstants } from '../constants/smileyConstants'
import { setToStorage } from './cookie'
import { secretDebug } from './debug'
import { personalDataProcessingConsentName } from './authFormHelper'

export const playSound = async (messageSubtype: string, messageType: string): Promise<void> => {
	if (
		messageSubtype !== MessageSubType.Contact &&
		messageType !== MessageContent.Type.RateForm &&
		messageType !== MessageEventContent.Type.AgentJoin &&
		messageType !== MessageEventContent.Type.AgentLeave &&
		messageType !== MessageEventContent.Type.ChatTransfer
	) {
		const audio = await new Audio(`${ASSETS_BASE_URL}/assets/sounds/blackberry2.mp3`)
		const promiseResult = audio.play()

		if (promiseResult) {
			promiseResult.catch(error => {
				secretDebug('Could not play sound.', error)
			})
		}
	}
}

export interface MessageIdWithPosition {
	id: string
	position: MessagePosition
}
const defaultMaxDiffTimeInSeconds = 60

export const shouldBeInGroupWith = (firstMessage: Message, secondMessage: Message, maxDiff: number) =>
	Math.abs(differenceInSeconds(new Date(firstMessage.created), new Date(secondMessage.created))) < maxDiff &&
	firstMessage.author === secondMessage.author

export const sortMessagesByDate = (messages: Message[]) => {
	const newMessages = [...messages]
	return newMessages.sort((a, b) => a.created.getTime() - b.created.getTime())
}

// TODO check if this is still needed
// Hide QuestionForm and AuthForm when they were already filled
export const removeFormsWhenFilled = (messages: Message[]) => {
	const filteredItems: Message[] = []

	const filledMessages = messages.filter(
		message => message.type === MessageContent.Type.QuestionFormSubmit,
	) as FilledMessage[]
	const idsToFilter = filledMessages.map(element => element.parentMessageId)

	messages.forEach(message => message.id !== idsToFilter.find(id => id === message.id) && filteredItems.push(message))

	return filteredItems
}

export const groupMessages = (
	messages: Message[],
	maxDiff: number = defaultMaxDiffTimeInSeconds,
): MessageIdWithPosition[] => {
	// mark all of the messages as standalone
	const result: MessageIdWithPosition[] = messages.map(m => ({
		id: m.id,
		position: MessagePosition.Standalone,
	}))

	// if just one message return because that message is standalone
	if (messages.length <= 1) {
		return result
	}

	// fix the first one (top or standalone)
	if (shouldBeInGroupWith(messages[0], messages[1], maxDiff)) {
		result[0].position = MessagePosition.Top
	}

	// fix the last one (bottom or standalone)
	if (shouldBeInGroupWith(messages[messages.length - 2], messages[messages.length - 1], maxDiff)) {
		result[messages.length - 1].position = MessagePosition.Bottom
	}

	// fix the one in the middle
	for (let i = 1; i < messages.length - 1; i += 1) {
		const inGroupWithUpper = shouldBeInGroupWith(messages[i - 1], messages[i], maxDiff)
		const inGroupWithDown = shouldBeInGroupWith(messages[i], messages[i + 1], maxDiff)

		if (inGroupWithDown && inGroupWithUpper) {
			result[i].position = MessagePosition.Middle
		}

		if (inGroupWithDown && !inGroupWithUpper) {
			result[i].position = MessagePosition.Top
		}

		if (!inGroupWithDown && inGroupWithUpper) {
			result[i].position = MessagePosition.Bottom
		}
	}
	return result
}

export const mapMessageFromServerToLocal = (message: IMessage) => {
	if (message.subType === MessageSubType.Trigger) {
		const result: MessageTrigger = {
			trigger: message.trigger,
			author: MessageSubType.Trigger,
			created: new Date(message.createdAt),
			id: message.id,
			agentId: null,
			text: message.content.text,
			type: MessageType.Trigger,
		}
		return result
	}

	if (message.content.type === MessageContent.Type.Upload) {
		const result: MessageFile = {
			type: message.content.type,
			created: new Date(message.createdAt),
			id: message.id,
			author: message.subType === MessageSubType.Contact ? MessageSubType.Contact : MessageSubType.Agent,
			fileType: message.content.data.fileType,
			name: message.content.data.fileName,
			uploadedWithError: false,
			url: message.content.data.url,
			expireAt: message.content.data.expireAt,
			isImage: message.content.data.type === FileUploadType.Image,
			thumb400: {
				url: (message.content.data.thumb400 && message.content.data.thumb400.url) || undefined,
			},
		}
		return result
	}

	if (message.subType === MessageSubType.Contact || message.subType === MessageSubType.Agent) {
		const result: MessageText = {
			type: MessageContent.Type.Text,
			agentId: message.agentId,
			created: new Date(message.createdAt),
			id: message.id,
			text: message.content.text,
			author: message.subType === MessageSubType.Contact ? MessageSubType.Contact : MessageSubType.Agent,
		}
		return result
	}

	if (message.subType === MessageSubType.Bot) {
		const messageBot = message as MessageBot

		const result: MessageTextBot = {
			type: MessageContent.Type.Text,
			agentId: messageBot.agentId,
			created: new Date(messageBot.createdAt),
			id: messageBot.id,
			text: messageBot.content.text,
			author: MessageSubType.Bot,
			quickReplies: messageBot.quickReplies,
			showReplies: true,
		}
		return result
	}

	if (
		message.content.type === MessageEventContent.Type.AgentLeave ||
		message.content.type === MessageEventContent.Type.AgentAssign ||
		message.content.type === MessageEventContent.Type.AgentJoin ||
		message.content.type === MessageEventContent.Type.AgentUnassign
	) {
		const result: AgentActivity = {
			type: message.content.type,
			created: new Date(message.createdAt),
			id: message.id,
			agentStatus: message.content.type,
			agentId: (message.content && message.content.data && message.content.data.agentId) || '',
			author: MessageSubType.System,
			assigned: message.content.data.assigned,
			unassigned: message.content.data.unassigned,
		}
		return result
	}

	if (message.content.type === MessageEventContent.Type.ChatClose && message.content.data.closeType === 'agent_close') {
		const result: AgentActivity = {
			type: message.content.type,
			created: new Date(message.createdAt),
			id: message.id,
			agentStatus: message.content.type,
			agentId: message.content.data.agentId || '',
			author: MessageSubType.System,
		}
		return result
	}

	if (message.content.type === MessageEventContent.Type.ChatVisitorClose) {
		const result: AgentActivity = {
			type: message.content.type,
			created: new Date(message.createdAt),
			id: message.id,
			agentStatus: message.content.type,
			agentId: null,
			author: MessageSubType.System,
		}
		return result
	}

	if (message.content.type === MessageContent.Type.RateForm) {
		const ratingText = message.content.data && message.content.data.text

		const mess: MessageRating = {
			type: MessageContent.Type.RateForm,
			author: MessageSubType.System,
			created: new Date(message.createdAt),
			finished: !!ratingText,
			id: message.id,
			headline: T.translate('agentRating.all.placeholder'),
			inputs: [
				{
					type: FormInputType.Text,
					name: 'rating',
					placeHolder: T.translate('agentRating.all.placeholder'),
					label: T.translate('agentRating.all.placeholder'),
					validations: ['required'],
					multiline: true,
					fullWidth: true,
					value: ratingText,
				},
			],
			rating: message.content.data && message.content.data.value,
			finishedRatingText: ratingText || '',
		}
		return mess
	}

	if (message.content.type === MessageEventContent.Type.ChatTransfer) {
		const result: AgentActivity = {
			type: MessageEventContent.Type.ChatTransfer,
			created: new Date(message.createdAt),
			id: message.id,
			agentStatus: MessageEventContent.Type.AgentJoin,
			agentId: message.agentId,
			author: MessageSubType.System,
		}

		return result
	}

	console.error('Unknown message', message)
	return undefined
}

export const mapAgentFromServerToLocal = (agent: IAgent | ISimpleAgent) => {
	const result: Agent = {
		// Makes sure that avatar size is optimized
		avatar: agent.avatar ? `${agent.avatar}${AVATAR_SIZE_SUFFIX}` : undefined,
		fullname: agent.fullname,
		name: agent.fullname,
		id: agent.id,
		status: agent.status,
		description: agent.description,
		email: '',
		groups: agent.groups,
		disabled: agent.disabled,
	}
	return result
}

export const lastTextMessageSent = (smartMessages: Message[]) => {
	const textMessages = smartMessages
		.filter(m => m.author === MessageSubType.Contact && m.type === MessageContent.Type.Text)
		.sort((a, b) => a.created.getTime() - b.created.getTime())

	return textMessages[textMessages.length - 1] as MessageText
}

export const filterLatestTriggerMessages = (messages: MessageBase[]) =>
	messages
		.filter(
			message =>
				(message.type === MessageType.Trigger || message.type === MessageContent.Type.Text) &&
				message.author !== MessageSubType.Contact,
		)
		.sort((a, b) => b.created.getTime() - a.created.getTime())

export const nonSystemMessages = (messages: Message[]): Message[] =>
	messages.filter(m => m.author !== MessageSubType.System)

export const filterUserAgentMessages = (messages: Message[]) =>
	messages.filter(m => m.author === MessageSubType.Agent || m.author === MessageSubType.Contact)

export const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string

export const replaceWithMap = (text: string, map: { [r: string]: string }) => {
	const regEx = new RegExp(
		Object.keys(map)
			.map(key => `(^| )${escapeRegExp(key)}($| )`)
			.join('|'),
		'gi',
	)
	return text.replace(regEx, matched => {
		const seleted = Object.keys(map).filter(k => matched.includes(k))[0]
		return map[seleted].toString()
	})
}

export const replaceEmojisInText = (text: string) => replaceWithMap(text, EmojiConstants)

export const saveChatIsOpenToCookie = (isOpen: boolean) => {
	setToStorage(storageOpenName, `${isOpen}`, false, true)
}

export const saveChatInputTextToCookie = (text: string) => {
	// Prevents input text from saving to localStorage, only to cookie
	setToStorage(storageTextName, text, false, true)
}

interface ValuesFromForm {
	name?: string
	email?: string
	phone?: string
	group?: string
	personalDataProcessingConsent?: boolean
}

export const getValuesFromForm = (inputs: FormInput[]): ValuesFromForm => {
	const name = inputs.find(i => i.name === 'name')
	const email = inputs.find(i => i.name === 'email')
	const phone = inputs.find(i => i.name === 'phone')
	const group = inputs.find(i => i.name === 'group')
	const personalDataProcessingConsent = inputs.find(i => i.name === personalDataProcessingConsentName)

	return {
		name: name ? name.value.toString() : undefined,
		email: email ? email.value.toString() : undefined,
		phone: phone ? phone.value.toString() : undefined,
		group: group ? group.value.toString() : undefined,
		personalDataProcessingConsent: personalDataProcessingConsent ? !!personalDataProcessingConsent.value : undefined,
	}
}

export const lastTextMessage = (messages: Message[]) => {
	if (messages.length) {
		const sortedMessages = sortMessagesByDate(messages)
		const textMessages = sortedMessages.filter(m => m.type === MessageContent.Type.Text && m.text)
		if (textMessages.length) {
			return textMessages[textMessages.length - 1] as MessageText
		}
	}
	return undefined
}

export const userSentSameMessageTwiceInRow = (messages: Message[], text: string) => {
	const lastMessage = lastTextMessage(messages)
	if (lastMessage && text === lastMessage.text && lastMessage.author === MessageSubType.Contact) {
		return true
	}
	return false
}
