export enum LoadingState {
	Initial = 'INITIAL',
	Loading = 'LOADING',
	Success = 'SUCCESS',
	Failure = 'FAILURE',
}

export enum WarningBarState {
	Initial = 'INITIAL',
	Failure = 'FAILURE',
	NotAllowedAsFirstMessage = 'NOT_ALLOWED_AS_FIRST_MESSAGE',
	FileTooBig = 'FILE_TOO_BIG',
	TooManyFiles = 'TOO_MANY_FILES',
	FilesWerentProcessed = 'FILES_WERENT_PROCESSED',
	BadExtension = 'BAD_EXTENSION',
	SameMessageTwice = 'SAME_MESSAGE_TWICE',
}

export enum FileUploadState {
	Initial = 'INITIAL',
	Loading = 'LOADING',
}

export enum AgentRating {
	Good = 5,
	Normal = 3,
	Bad = 1,
}

export enum WarningBarType {
	Disconnect = 'DISCONNECT',
	UploadFailure = 'UPLOAD_FAILURE',
	FileRestricted = 'FILE_RESTRICTED',
	MessageRestricted = 'MESSAGE_RESTRICTED',
}

export enum ChatStatus {
	ClosedByVisitor = 'CLOSED_BY_VISITOR',
	Opened = 'OPENED',
	Pending = 'PENDING',
	Resolved = 'RESOLVED',
	Served = 'SERVED',
}

export enum InitialChatStatus {
	Closed = 'closed',
	Open = 'open',
	Pending = 'pending',
	Served = 'served',
}
