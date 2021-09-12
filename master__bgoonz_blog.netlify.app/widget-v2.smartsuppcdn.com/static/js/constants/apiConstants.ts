import { getSsWidget } from '../utils/sdk'
import { ChatOrientation } from '../model/ChatPosition'

export enum GAAccountTypes {
	Internal = 'internal',
	Universal = 'universal',
}

export const COMPANY_NAME = 'Smartsupp.com'

export const ASSETS_BASE_URL: string = getSsWidget().getBaseUrl()

export enum SmartsuppPackage {
	Free = 'free',
	Trial = 'trial',
	Standard = 'standard',
	Pro = 'pro',
}

export interface SmartsuppFeatures {
	api: boolean
	ga: boolean
	whiteLabel: boolean
}

// TODO: move to backend, should be fetched with extensions
// File upload
// eslint-disable-next-line no-magic-numbers
export const MAX_UPLOAD_FILES_LIMIT = 5

export enum AllowedApiCalls {
	Telefon = 'telefon',
	Telephone = 'telephone',
	Name = 'name',
	Group = 'group',
	Email = 'email',
	Phone = 'phone',
	Variables = 'variables',
	Language = 'language',
	ChatClose = 'chat:close',
	ChatOpen = 'chat:open',
	ChatShow = 'chat:show',
	ChatHide = 'chat:hide',
	ThemeColor = 'theme:color',
	Logout = 'logout',
	ChatMessage = 'chat:message',
	RecordingDisable = 'recording:disable',
	RecordingOff = 'recording:off',
	SettingsGetTranslates = 'settings:get_translates',
	HtmlApply = 'html:apply',
	On = 'on',
}

export enum EventsSupported {
	MessageSent = 'message_sent',
	MessageReceived = 'message_received',
}

export const AVATAR_SIZE_SUFFIX = '?size=80'

// Get orientation of the chat from dash
export const chatPosition: ChatOrientation = getSsWidget().options.orientation
