import { sendGA } from './googleAnalyticsSetup'
import { AgentRating } from '../../model/Enums'
import { gaDebug } from '../debug'

// GA names
const triggerMessageSent = 'Triggered message sent'
const triggerMessageViewed = 'Trigger message viewed'
const triggerStartedConversation = 'Trigger started conversation'
const visitorStartedConversation = 'Visitor started conversation'
const conversationServed = 'Conversation served'
const authFormFilled = 'Auth form filled'
const offlineMessageSent = 'Offline message sent'
const chatbotSent = 'Chatbot sent'
const chatbotInteraction = 'Chatbot interaction'
const chatbotButtonInteraction = 'Chatbot button interaction'
const chatbotStartedConversation = 'Chatbot started conversation '

// Shared settings
const GASettings = {
	category: 'SmartSupp',
	nonInteraction: true,
	value: 1,
}

const fireGA = (action: string, label: string): void => {
	const googleAnalyticsData = { ...GASettings, action, label }
	gaDebug(googleAnalyticsData)
	sendGA(googleAnalyticsData)
}

export const triggerSentMessageGA = (triggerName = ''): void => fireGA(triggerMessageSent, triggerName)
export const triggerMessageOpenedGA = (triggerName: string): void => fireGA(triggerMessageViewed, triggerName)
export const triggerStatedConversationGA = (triggerName = ''): void => fireGA(triggerStartedConversation, triggerName)
export const visitorStartedConversationGA = (): void => fireGA(visitorStartedConversation, '')
export const conversationServedGA = (agentName: string): void => fireGA(conversationServed, agentName)
export const authFormFilledGA = (): void => fireGA(authFormFilled, '')
export const visitorSentOfflineMessage = (): void => {
	fireGA(offlineMessageSent, '')
}

export const feedbackSentGA = (feedback: AgentRating): void => {
	const possibleRating = [
		{
			rating: AgentRating.Bad,
			text: 'Bad',
		},
		{
			rating: AgentRating.Normal,
			text: 'Normal',
		},
		{
			rating: AgentRating.Good,
			text: 'Good',
		},
	]

	const rating = possibleRating.find(r => r.rating === feedback)
	fireGA('Feedback sent', rating?.text || '')
}

export const chatbotSentGA = (chatbotTitle = ''): void => fireGA(chatbotSent, chatbotTitle)
export const chatbotInteractionGA = (chatbotTitle = ''): void => fireGA(chatbotInteraction, chatbotTitle)
export const chatbotButtonInteractionGA = (buttonTitle = ''): void => fireGA(chatbotButtonInteraction, buttonTitle)
export const chatbotStartedConversationGA = (chatbotTitle = ''): void =>
	fireGA(chatbotStartedConversation, chatbotTitle)
