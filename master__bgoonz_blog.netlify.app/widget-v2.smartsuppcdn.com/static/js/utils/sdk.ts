import { Loader } from '../../_types/loader'
import { MappedWidget, Widget } from '../../_types/widget'
import { ButtonStyle, ChatOrientation } from '../model/ChatPosition'
import { secretDebug } from './debug'

const hostWindow = window.parent as any
const currentWindow = window as any
const CHAT_ID_DATA_ATTR = 'data-smartsupp-id'

export const getSsLoader = (): Loader => {
	if (hostWindow.$smartsupp) {
		return hostWindow.$smartsupp as Loader
	}

	return { getChat: () => undefined, on: () => undefined, fire: () => undefined } as any
}

export const mapSsOptions = (widget: Widget): MappedWidget => {
	const { installApi, getBaseUrl, ...rest } = widget

	return {
		...rest,
		options: {
			...rest.options,
			orientation: rest.options.alignX || rest.options.orientation || ChatOrientation.Right,
			cookieDomain: rest.options.cookieDomain || '',
			cookiePath: rest.options.cookiePath || '/',
			buttonStyle: rest.options.buttonStyle || ButtonStyle.Greeting,
		},
		installApi: installApi.bind(widget),
		getBaseUrl: getBaseUrl.bind(widget),
	}
}

export const getSsWidget = (): MappedWidget => {
	// Get options stub for testing in Cypress
	if (currentWindow.$smartsuppTest) {
		const testOptions = currentWindow.$smartsuppTest
		return mapSsOptions(testOptions)
	}

	if (hostWindow.$smartsupp) {
		const bodyEl = document.getElementsByTagName('body')[0]
		const chatId = bodyEl.getAttribute(CHAT_ID_DATA_ATTR)

		if (!chatId) throw new Error(`Missing attribute "${CHAT_ID_DATA_ATTR}" on body element.`)

		return mapSsOptions(getSsLoader().getChat(chatId))
	}

	return {
		options: {},
		installApi: () => undefined,
		getBaseUrl: () => '',
	} as any
}

// For Dev purpose only
secretDebug('User options', getSsWidget().options)
