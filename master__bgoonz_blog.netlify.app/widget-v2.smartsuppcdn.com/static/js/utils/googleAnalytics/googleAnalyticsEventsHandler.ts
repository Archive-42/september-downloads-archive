import { AccountStatus, IMessage, MessageSubType } from '@smartsupp/websocket-client'

import store from 'store'

import {
	triggerMessageOpenedGA,
	triggerSentMessageGA,
	visitorSentOfflineMessage,
	triggerStatedConversationGA,
	visitorStartedConversationGA,
	chatbotSentGA,
	chatbotInteractionGA,
	chatbotStartedConversationGA,
} from './googleAnalyticsEvents'
import { Message, MessageTrigger } from '../../model/Message'
import { nonSystemMessages } from '../messageHelpers'

const visitorSentFirstMessage = (messages: Message[], messageSubType: MessageSubType) =>
	nonSystemMessages(messages).length === 0 && messageSubType === MessageSubType.Contact

const botSentFirstMessage = (messages: Message[], messageSubType: MessageSubType) =>
	nonSystemMessages(messages).length === 0 && messageSubType === MessageSubType.Bot

const visitorRespondedToTriggerMessage = (messages: Message[], receivedMessage: IMessage) => {
	const nonSystemMessagesList = nonSystemMessages(messages)
	return (
		receivedMessage.subType === MessageSubType.Contact &&
		nonSystemMessagesList.every(message => message.author === MessageSubType.Trigger)
	)
}

const visitorRespondedToBotMessage = (messages: Message[], receivedMessage: IMessage) => {
	const nonSystemMessagesList = nonSystemMessages(messages)
	return (
		receivedMessage.subType === MessageSubType.Contact &&
		!receivedMessage.groupId &&
		nonSystemMessagesList[nonSystemMessagesList.length - 1].author === MessageSubType.Bot
	)
}

const chatbotStartedReaction = (messages: Message[], receivedMessage: IMessage) => {
	const nonSystemMessagesList = nonSystemMessages(messages)
	return (
		receivedMessage.subType === MessageSubType.Contact &&
		receivedMessage.groupId &&
		nonSystemMessagesList.every(message => message.author === MessageSubType.Bot)
	)
}
export const botMessageSentGALogger = (messages: Message[], receivedMessage: IMessage): void => {
	const botName = store.getState().messages.currentBotName

	if (botSentFirstMessage(messages, receivedMessage.subType)) {
		chatbotSentGA(botName)
	} else if (visitorRespondedToBotMessage(messages, receivedMessage)) {
		chatbotStartedConversationGA(botName)
	} else if (chatbotStartedReaction(messages, receivedMessage)) {
		chatbotInteractionGA(botName)
	}
}
export const messageReceivedGaLogger = (messages: Message[], receivedMessage: IMessage): void => {
	if (receivedMessage.subType === MessageSubType.Trigger) {
		triggerSentMessageGA(receivedMessage?.trigger?.name)
	}

	if (visitorSentFirstMessage(messages, receivedMessage.subType)) {
		visitorStartedConversationGA()
	} else if (visitorRespondedToTriggerMessage(messages, receivedMessage)) {
		const triggerMessage = nonSystemMessages(messages)[0] as MessageTrigger
		triggerStatedConversationGA(triggerMessage.trigger?.name)
	}
}

export const triggerMessageOpenedGaLogger = (triggerName?: string): void => {
	if (!triggerName) return
	triggerMessageOpenedGA(triggerName)
}

export const offlineMessageSentGaLogger = (status: AccountStatus): void => {
	if (status !== AccountStatus.Offline) return
	visitorSentOfflineMessage()
}
