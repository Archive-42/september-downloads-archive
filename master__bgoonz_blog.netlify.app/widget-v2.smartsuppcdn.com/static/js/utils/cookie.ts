import * as Sentry from '@sentry/browser'
import { Cookie } from './jsCookie/index'
import { getSsWidget } from './sdk'
import {
	defaultStorageIdExpirationInDays,
	LOCAL_STORAGE_OBJECT_NAME,
	cookieNameHelper,
	CRITICAL_COOKIES_LIST,
	LOCAL_STORAGE_EXCEEDED_CODE,
} from '../constants/cookies'
import { secretDebug } from './debug'
import { COOKIE_CHECK_TIMER } from '../constants/timeoutConstants'

// Is here separately in a function in order to be able to reset cookies and localStorage, if it was not a function it would not be possible
export const getDataFromLocalStorage = () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_OBJECT_NAME) || '{}')

const generateDefaultSetting = (expirationInDays = defaultStorageIdExpirationInDays) => ({
	expires: expirationInDays,
	domain: getSsWidget().options.cookieDomain,
	path: getSsWidget().options.cookiePath,
	sameSite: 'strict' as const,
	secure: window.top.location.protocol === 'https:',
})

// IMPORTANT! When deleting a cookie and you're not relying on the default attributes, you must pass the exact same path and domain attributes that were used to set the cookie:
// Cookies.set('name', 'value', { path: '' })
// Cookies.remove('name') // fail!
// Cookies.remove('name', { path: '' }) // removed!
// When creating new cookies with custom expiration attribute add them here and use them in setting new ones in to order to be able to remove old one

export const setToStorage = (
	name: string,
	value: string | Record<string, unknown>,
	excludeLocalStorage = false,
	excludeCookie = false,
	expirationInDays: number = defaultStorageIdExpirationInDays,
	options?: Cookies.CookieAttributes | undefined,
) => {
	// Cookies
	if (!excludeCookie) {
		Cookie.set(cookieNameHelper(name), value, { ...generateDefaultSetting(expirationInDays), ...options })
	}

	// Local storage
	if (!excludeLocalStorage) {
		const dataFromLocalStorage = getDataFromLocalStorage()
		const localStorageToSet = { ...dataFromLocalStorage, [name]: value.toString() }
		try {
			localStorage.setItem(LOCAL_STORAGE_OBJECT_NAME, JSON.stringify(localStorageToSet))
		} catch (error) {
			if (error.code === LOCAL_STORAGE_EXCEEDED_CODE) {
				console.error('localStorage is full', error)
			}
			console.error('error setting localStorage', error)
		}
	}

	// Check
	setTimeout(() => {
		const cookieData = Cookie.get(cookieNameHelper(name))
		const localStorageData = getFromStorage(name)

		if (cookieData !== value && localStorageData !== value.toString()) {
			secretDebug('cookie not set debug', cookieData, value)
			secretDebug('localStorage not set debug', localStorageData, value)

			if (CRITICAL_COOKIES_LIST.includes(name)) {
				Sentry.withScope(scope => {
					Sentry.captureException({
						message: 'Cookie and localStorage not set',
						name,
						cookieData,
						localStorageData,
						value,
					})
				})

				console.error('Cookie not set!')
			}
		}
	}, COOKIE_CHECK_TIMER)
}

export const getFromStorage = (name: string): string | undefined | null => {
	// Cookies
	const dataFromCookie = Cookie.get(cookieNameHelper(name))

	// Local storage
	const dataFromLocalStorage = getDataFromLocalStorage()
	const localDataItem = dataFromLocalStorage[name] ? dataFromLocalStorage[name] : undefined

	return dataFromCookie || localDataItem
}
