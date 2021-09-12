import { TinyEmitter } from 'tiny-emitter'
import { IMessage } from '@smartsupp/websocket-client'

import store from 'store'
import { showWidget, toggleOpenCloseWidget, GeneralAction } from 'store/general/actions'
import { DEFAULT_LOCALE } from 'store/translations/constants'
import { MessageAction } from 'store/messages/actions'
import { AllowedApiCalls, EventsSupported, SmartsuppPackage } from 'constants/apiConstants'

import { visitorClient } from './connect'
import { pubSub } from './pubSub'
import { getSsWidget } from './sdk'

interface ApiVariables {
	name: string
	group: string
	email: string
	variables: string
	language: string
	phone: string
}

export const emitter = new TinyEmitter()
export const apiVariables: Partial<ApiVariables> = {}

export const generateFileDownloadUrl = (name: string, url?: string) => {
	if (url) {
		return `${url}?name=${name}`
	}
	return undefined
}

const isObject = (o: any) => typeof o === 'object' && o !== null

export const formatVariables = (o: any) => {
	if (!isObject(o)) {
		return o
	}
	Object.keys(o).forEach(key => {
		o[key] = isObject(o[key]) ? o[key].value : o[key]
	})
	return o
}

const listenToEvent = (name: string, callback: unknown): void => {
	if (typeof callback !== 'function') {
		console.error(`${callback} is not a function.`)
		return
	}

	switch (name) {
		case EventsSupported.MessageSent:
			emitter.on(EventsSupported.MessageSent, (message: IMessage) => {
				callback(message)
			})
			break
		case EventsSupported.MessageReceived:
			emitter.on(EventsSupported.MessageReceived, (message: IMessage) => {
				callback(message)
			})
			break
		default:
			console.error('Unknown event.')
	}
}

export const mapApiCall = (name: AllowedApiCalls, param: any, ...args: unknown[]): void => {
	// Free users do not have the right to use api
	const packageName: SmartsuppPackage = getSsWidget().options.package
	if (packageName === SmartsuppPackage.Free) {
		return
	}

	if (name === AllowedApiCalls.Telefon || name === AllowedApiCalls.Telephone) {
		// eslint-disable-next-line
		name = AllowedApiCalls.Phone
	}

	switch (name) {
		case AllowedApiCalls.SettingsGetTranslates:
			pubSub.subscribe(name, param)
			break
		case AllowedApiCalls.Variables:
			apiVariables[name] = formatVariables(param)

			store.dispatch(GeneralAction.updateUser({ [name]: formatVariables(param) }))
			try {
				visitorClient.client.update({ [name]: formatVariables(param) })
			} catch (error) {
				// Visitor client is not connected yet
			}
			break
		case AllowedApiCalls.Name:
		case AllowedApiCalls.Group:
		case AllowedApiCalls.Email:
		case AllowedApiCalls.Phone:
			apiVariables[name] = param
			store.dispatch(GeneralAction.updateUser({ [name]: param }))
			try {
				visitorClient.client.update({ [name]: param })
			} catch (error) {
				// Visitor client is not connected yet
			}
			break
		case AllowedApiCalls.Language:
			apiVariables[name] = param || DEFAULT_LOCALE
			break
		case AllowedApiCalls.ChatClose:
			store.dispatch(toggleOpenCloseWidget(false, false))
			break
		case AllowedApiCalls.ChatOpen:
			store.dispatch(toggleOpenCloseWidget(true, true))
			store.dispatch(showWidget())
			break
		case AllowedApiCalls.ChatShow:
			store.dispatch(showWidget())
			break
		case AllowedApiCalls.ChatHide:
			store.dispatch(GeneralAction.widgetHide())
			break
		case AllowedApiCalls.ThemeColor:
			if (getSsWidget().options.features.api) {
				store.dispatch(GeneralAction.setThemeColor(param))
			}
			break
		case AllowedApiCalls.ChatMessage:
			store.dispatch(MessageAction.setInputText(param))
			break
		case AllowedApiCalls.RecordingDisable:
			break
		case AllowedApiCalls.RecordingOff:
			break
		case AllowedApiCalls.On:
			listenToEvent(param, args[0])
			break
		// Special kind of request that should be ignored but not throw console.log
		case AllowedApiCalls.HtmlApply:
			break
		default:
			console.warn('unknown API', name, param)
	}
}
