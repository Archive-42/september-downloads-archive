import { mergeWith } from 'lodash'
import { apiVariables } from '../../utils/apiHelper'
import { AVAILABLE_LANGS, configLang, DEFAULT_LOCALE } from './constants'
import { AllowedApiCalls, ASSETS_BASE_URL } from '../../constants/apiConstants'
import { pubSub } from '../../utils/pubSub'
import { getSsWidget } from '../../utils/sdk'

export const getLanguagesToDownload = (): Array<string> => {
	const lang = apiVariables.language ? apiVariables.language : configLang.lang
	const langToDownload = AVAILABLE_LANGS.includes(lang) ? lang : DEFAULT_LOCALE
	return Array.from(new Set([langToDownload, DEFAULT_LOCALE]))
}

export const constructUrlForTranslationDownload = (language: string): string =>
	`${ASSETS_BASE_URL}/translates/${language}.json?v=${process.env.REACT_APP_VERSION || ''}`

export const publishTranslatesToDash = (
	translates: Record<string, unknown>,
	defaultTranslates: Record<string, unknown>,
): void => {
	const customTranslates = getSsWidget().options.translates

	pubSub.publish(AllowedApiCalls.SettingsGetTranslates, {
		translates: mergeWith({ ...translates }, defaultTranslates, translates, (defaultTranslate, translate) =>
			translate === '' ? defaultTranslate : undefined,
		),
		customText: customTranslates,
	})
}
