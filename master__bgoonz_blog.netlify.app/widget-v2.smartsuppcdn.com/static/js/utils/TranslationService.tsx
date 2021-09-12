import { getSsWidget } from './sdk'

interface Translations {
	[s: string]: string
}
interface TranslationData {
	data: Translations
	defaultData: Translations
	customData: Translations
}

const innerData: TranslationData = {
	data: {},
	defaultData: {},
	customData: {},
}

export class TranslationService {
	static translate = (key: string): string =>
		innerData.customData[key] || innerData.data[key] || innerData.defaultData[key] || `|${key}|`

	static setData = (translationData: Translations): void => {
		if (translationData) innerData.data = translationData
	}

	static setDefaultLanguageData = (translationData: Translations): void => {
		if (translationData) innerData.defaultData = translationData
	}

	static setCustomLanguageData = (language: string): void => {
		const customTranslates = getSsWidget().options.translates
		if (customTranslates[language]) innerData.customData = customTranslates[language]
	}
}
