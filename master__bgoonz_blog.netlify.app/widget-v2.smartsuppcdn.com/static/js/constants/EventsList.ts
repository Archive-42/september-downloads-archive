export enum AccountEvent {
	Updated = 'account.updated',
}

export enum AgentEvent {
	StatusUpdated = 'agent.status_updated',
	Removed = 'agent.removed',
	Updated = 'agent.updated',
}

export enum ChatEvent {
	AgentAssigned = 'chat.agent_assigned',
	AgentJoined = 'chat.agent_joined',
	AgentTyping = 'chat.agent_typing',
	AgentLeft = 'chat.agent_left',
	AgentUnassigned = 'chat.agent_unassigned',
	Closed = 'chat.closed',
	ContactRead = 'chat.contact_read',
	MessageReceived = 'chat.message_received',
	MessageUpdated = 'chat.message_updated',
	Opened = 'chat.opened',
	Served = 'chat.served',
	Updated = 'chat.updated',
	VisitorClosed = 'chat.visitor_closed',
}

export enum VisitorEvent {
	Connect = 'visitor.connect',
	Connected = 'visitor.connected',
	Updated = 'visitor.updated',
}

export enum GeneralEvent {
	Connect = 'connect',
	Disconnect = 'disconnect',
	Error = 'error',
	Initialized = 'initialized',
}
