import { getSsWidget } from '../utils/sdk'

export const SS_COOKIE_PREFIX = 'ssupp'

// Special case for smartsupp homepage, where prefix is needed in order to prevent name clash
const cookieNamePrefix = getSsWidget().options.cookiePrefix ? getSsWidget().options.cookiePrefix : ''
export const cookieNameHelper = (name: string) => `${cookieNamePrefix}${SS_COOKIE_PREFIX}.${name}`

export const storageIdName = 'vid'
export const storageVisitsName = 'visits'
export const storageOpenName = 'opened'
export const storageTextName = 'message'
export const showWidgetButtonAnimationName = 'showButtonAnimation'
export const defaultStorageIdExpirationInDays = 182

export const LOCAL_STORAGE_OBJECT_NAME = `${SS_COOKIE_PREFIX}_${getSsWidget().options.key}`
export const CRITICAL_COOKIES_LIST = [storageIdName, storageVisitsName]
export const LOCAL_STORAGE_EXCEEDED_CODE = 22
