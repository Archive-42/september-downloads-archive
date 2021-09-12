import { getSsWidget } from './sdk'

export const getServerUrl = (): string => {
	const protocol = getSsWidget().options.protocol === 'http' ? 'http' : 'https'
	const { host } = getSsWidget().options

	return `${protocol}://${host}`
}
