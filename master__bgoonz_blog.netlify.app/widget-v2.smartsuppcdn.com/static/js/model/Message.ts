import { MessageSubType, MessageEventContent, MessageContent, IMessageTrigger } from '@smartsupp/websocket-client'
import { FormInput } from './FormInput'
import { LoadingState, AgentRating } from './Enums'

export enum MessagePosition {
	Top = 'TOP',
	Middle = 'MIDDLE',
	Bottom = 'BOTTOM',
	Standalone = 'STANDALONE',
}

export enum MessageType {
	Text = 'TEXT',
	Rating = 'RATING',
	File = 'FILE',
	AgentActivity = 'AGENTACTIVITY',
	Form = 'FORM',
	Trigger = 'TRIGGER',
	FilledForm = 'FILLEDFORM',
}

export enum RatingOptions {
	Yes = 'YES',
	No = 'NO',
}

export enum FileUploadType {
	Image = 'image',
	File = 'file',
}

export enum AgentActivityStatus {
	Join = 'JOIN',
	Leave = 'LEAVE',
	RedirectToAnother = 'REDIRECTTOANOTHER',
}

export enum FormActionType {
	SendTranscript = 'TRANSCRIPT',
	PreForm = 'PREFORM',
	AwayForm = 'AWAY_FORM',
}

/**
 * Base interface for all the Message items
 */
export interface MessageBase {
	id: string
	created: Date
	type: MessageContent.Type | MessageEventContent.Type | MessageType
	author: MessageSubType
	position?: MessagePosition
	fullname?: string | null
}

/**
 * Interface for message item
 */
export interface MessageText extends MessageBase {
	type: MessageContent.Type.Text
	text: string | null
	noPosition?: boolean
	agentId: string | null
}

export interface MessageTextBot extends MessageBase {
	type: MessageContent.Type.Text
	text: string | null
	noPosition?: boolean
	agentId: string | null
	quickReplies?: any[]
	showReplies: boolean
}

export interface MessageTrigger extends MessageBase {
	type: MessageType.Trigger
	text: string | null
	trigger: IMessageTrigger | null
	noPosition?: boolean
	agentId: string | null
}

export interface FilledMessage extends MessageBase {
	type: MessageContent.Type.QuestionFormSubmit
	inputs: FormInput[]
	actionType?: FormActionType
	parentMessageId: string
	noPosition?: boolean
}

export type AgentActivityType =
	| MessageEventContent.Type.AgentJoin
	| MessageEventContent.Type.AgentAssign
	| MessageEventContent.Type.AgentLeave
	| MessageEventContent.Type.AgentUnassign
	| MessageEventContent.Type.ChatTransfer
	| MessageEventContent.Type.ChatClose
	| MessageEventContent.Type.ChatVisitorClose

export interface AgentActivity extends MessageBase {
	type: AgentActivityType
	agentStatus: MessageEventContent.Type
	agentId: string | null
	assigned?: string
	unassigned?: string
}

export interface MessageRating extends MessageBase {
	type: MessageContent.Type.RateForm
	rating: AgentRating | undefined
	finished: boolean
	headline: string
	inputs: FormInput[]
	formSendingState?: LoadingState
	finishedRatingText: string | undefined
}

export interface MessageForm extends MessageBase {
	type: MessageContent.Type.QuestionForm
	finished: boolean
	text?: string
	inputs: FormInput[]
	formSendingState?: LoadingState
	actionType?: FormActionType
	additionalData?: any
}

export interface MessageFile extends MessageBase {
	type: MessageContent.Type.Upload
	isImage: boolean
	expireAt?: string
	size?: number
	width?: number
	height?: number
	thumb400?: {
		url: string | undefined
		expireAt?: string
		width?: number
		height?: number
	}
	url: string
	name: string
	fileType: string
	uploadedWithError: boolean
}

/**
 * Interface for all the message types
 */
export type Message =
	| MessageText
	| MessageRating
	| MessageFile
	| MessageForm
	| AgentActivity
	| MessageTrigger
	| FilledMessage
	| MessageTextBot
