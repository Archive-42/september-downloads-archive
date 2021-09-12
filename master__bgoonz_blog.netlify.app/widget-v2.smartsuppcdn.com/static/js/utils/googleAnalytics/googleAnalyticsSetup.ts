import ReactGA from 'react-ga'
import { getSsWidget } from '../sdk'
import { GAAccountTypes } from '../../constants/apiConstants'
import { secretDebug } from '../debug'

interface GoogleAnalyticsAccount {
	key: string
	type: string | undefined
	options?: { [key: string]: any }
}

type GoogleAnalyticsData = {
	category: string
	action: string
	label: string
	value: number
	nonInteraction: boolean
}

let accounts = [] as GoogleAnalyticsAccount[]

declare global {
	interface Window {
		ga: UniversalAnalytics.ga
	}
}

const defaultGASettings = { titleCase: false }

export const configGA = (): void => {
	const widgetOptions = getSsWidget().options || {}

	// If the user supplied gaKey in smartsupp code
	// than this will be the only key he wants to track events by
	if (widgetOptions.gaKey) {
		const nonAccountGAOptions: GoogleAnalyticsAccount = {
			key: widgetOptions.gaKey,
			options: { ...defaultGASettings, ...widgetOptions.gaOptions },
			type: GAAccountTypes.Internal,
		}
		accounts.push(nonAccountGAOptions)
	} else if (window.top.ga) {
		try {
			window.top.ga(() => {
				// If there are trackers on users webiste
				const topTrackers = window.top.ga.getAll()
				secretDebug('topTrackers', topTrackers)
				if (topTrackers) {
					for (let t = 0; t < topTrackers.length; t += 1) {
						const nonAccountTopGAOptions: GoogleAnalyticsAccount = {
							key: topTrackers[t].get('trackingId'),
							type: GAAccountTypes.Universal,
							options: {
								...defaultGASettings,
								cookieDomain: topTrackers[t].get('cookieDomain') || 'auto',
								name: topTrackers[t].get('name') || '',
							},
						}
						// If there is gaName specified and the user only wants to link the account
						// to a specific account, then search the topTrackers and if there is one
						// that has this name, then set it and break
						if (
							getSsWidget().options.gaName &&
							nonAccountTopGAOptions.options &&
							nonAccountTopGAOptions.options.name === getSsWidget().options.gaName
						) {
							accounts.push(nonAccountTopGAOptions)
							break
						}
						accounts.push(nonAccountTopGAOptions)
					}
				}
			})
		} catch (err) {
			console.error('Error during GA top trackers', err.message)
		}
	}

	// If user has "undocumented tag  _smartsupp.gaAccounts
	// then we loop through them and extract other trackers in that array
	const { gaAccounts } = getSsWidget().options as any
	if (gaAccounts) {
		accounts = [...accounts, ...gaAccounts]
	}

	accounts.forEach(acc => setupAccounts(acc))
}

const setupAccounts = (account: GoogleAnalyticsAccount) => {
	// setup cookieDomain
	account.options = account.options || {}
	if (!account.options.cookieDomain) {
		account.options.cookieDomain = window.top.document.domain
	}

	// create tracker
	if (account.type === GAAccountTypes.Internal) {
		// Check if user called api to set a specific name of the tracker
		const customTrackerName = getSsWidget().options && getSsWidget().options.gaName
		if (customTrackerName) {
			ReactGA.initialize(account.key, { gaOptions: { ...account.options, name: customTrackerName } })
		} else {
			ReactGA.initialize(account.key, { gaOptions: account.options })
		}
	}
}

export const sendGA = ({ category, action, label, value, nonInteraction }: GoogleAnalyticsData): void => {
	// Check if ga is enabled from root, or package
	const { ga } = getSsWidget().options.features
	if (!ga) {
		return
	}

	for (let i = 0; i < accounts.length; i += 1) {
		try {
			if (accounts[i].type === GAAccountTypes.Universal) {
				if (window.top.ga) {
					const trackers = window.top.ga.getAll()

					for (let j = 0; j < trackers.length; j += 1) {
						if (
							accounts[i].options &&
							(!accounts[i].options!.name || accounts[i].options!.name === trackers[j].get('name'))
						) {
							trackers[j].send('event', category, action, label, value, { nonInteraction })
						}
					}
				}
			}

			if (accounts[i].type === GAAccountTypes.Internal) {
				ReactGA.event({
					action,
					label,
					category,
					nonInteraction,
					value,
				})
			}
		} catch (error) {
			secretDebug('Smartsupp: GA error:', error.message)
		}
	}
}
