import * as Sentry from '@sentry/browser'
import { secretDebug } from './debug'

/**
 * @param message
 * @param err
 */
export const handleError = (message: string, err: Error | any) => {
	secretDebug('message', err)
	Sentry.captureException(err)
}
