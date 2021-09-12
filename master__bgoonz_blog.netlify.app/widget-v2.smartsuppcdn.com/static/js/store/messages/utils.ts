import { MessageContent, MessageSubType } from '@smartsupp/websocket-client'

import { MessageBase } from 'model/Message'

export const shouldMessageBeUnread = (message: MessageBase): boolean =>
	message.author === MessageSubType.Agent ||
	message.author === MessageSubType.Bot ||
	message.author === MessageSubType.Trigger ||
	message.type === MessageContent.Type.RateForm

export const getUnreadMessages = (messages: MessageBase[], lastReadTime: string | null): MessageBase[] =>
	lastReadTime
		? messages.filter(message => message.created > new Date(lastReadTime) && shouldMessageBeUnread(message))
		: messages.filter(message => shouldMessageBeUnread(message))
