import { getSsWidget } from 'utils/sdk'

const LOCALE_AR = 'ar'
const LOCALE_AZ = 'az'
const LOCALE_BG = 'bg'
const LOCALE_BR = 'br'
const LOCALE_BS = 'bs'
const LOCALE_CA = 'ca'
const LOCALE_CN = 'cn'
const LOCALE_CS = 'cs'
const LOCALE_DA = 'da'
const LOCALE_DE = 'de'
const LOCALE_EL = 'el'
const LOCALE_EN = 'en'
const LOCALE_ES = 'es'
const LOCALE_FA = 'fa'
const LOCALE_FI = 'fi'
const LOCALE_FIL = 'fil'
const LOCALE_FR = 'fr'
const LOCALE_HE = 'he'
const LOCALE_HI = 'hi'
const LOCALE_HR = 'hr'
const LOCALE_HU = 'hu'
const LOCALE_IS = 'is'
const LOCALE_IT = 'it'
const LOCALE_JA = 'ja'
const LOCALE_KA = 'ka'
const LOCALE_LT = 'lt'
const LOCALE_LV = 'lv'
const LOCALE_MK = 'mk'
const LOCALE_NL = 'nl'
const LOCALE_NO = 'no'
const LOCALE_PL = 'pl'
const LOCALE_PT = 'pt'
const LOCALE_RO = 'ro'
const LOCALE_RU = 'ru'
const LOCALE_SK = 'sk'
const LOCALE_SL = 'sl'
const LOCALE_SR = 'sr'
const LOCALE_SV = 'sv'
const LOCALE_TH = 'th'
const LOCALE_TR = 'tr'
const LOCALE_TW = 'tw'
const LOCALE_UK = 'uk'

export const DEFAULT_LOCALE = LOCALE_EN

export const AVAILABLE_LANGS = [
	LOCALE_AR,
	LOCALE_AZ,
	LOCALE_BG,
	LOCALE_BR,
	LOCALE_BS,
	LOCALE_CA,
	LOCALE_CN,
	LOCALE_CS,
	LOCALE_DA,
	LOCALE_DE,
	LOCALE_EL,
	LOCALE_EN,
	LOCALE_ES,
	LOCALE_FA,
	LOCALE_FI,
	LOCALE_FIL,
	LOCALE_FR,
	LOCALE_HE,
	LOCALE_HI,
	LOCALE_HR,
	LOCALE_HU,
	LOCALE_IS,
	LOCALE_IT,
	LOCALE_JA,
	LOCALE_KA,
	LOCALE_LT,
	LOCALE_LV,
	LOCALE_MK,
	LOCALE_NL,
	LOCALE_NO,
	LOCALE_PL,
	LOCALE_PT,
	LOCALE_RO,
	LOCALE_RU,
	LOCALE_SK,
	LOCALE_SL,
	LOCALE_SR,
	LOCALE_SV,
	LOCALE_TH,
	LOCALE_TR,
	LOCALE_TW,
	LOCALE_UK,
]
export const configLang = {
	lang: getSsWidget().options.lang,
}
