import { Dispatch } from 'redux'
import { action, Action, payload } from 'ts-action'
import { TranslationService } from '../../utils/TranslationService'
import { AppThunkAction } from '../../types'
import { constructUrlForTranslationDownload, getLanguagesToDownload, publishTranslatesToDash } from './utils'

export const TranslationAction = {
	isFetchingTranslations: action('translations/SET_IS_FETCHING_TRANSLATIONS', payload<boolean>()),
}

export const fetchTranslations: AppThunkAction<TranslationActionType> = async (
	dispatch: Dispatch<Action>,
): Promise<void> => {
	dispatch(TranslationAction.isFetchingTranslations(true))

	const languages = getLanguagesToDownload()
	const promises = languages.map((language: string) =>
		fetch(constructUrlForTranslationDownload(language)).then((response: Response) => response.json()),
	)
	const [translates, defaultTranslates] = await Promise.all(promises)

	TranslationService.setData(translates)
	TranslationService.setDefaultLanguageData(defaultTranslates)
	TranslationService.setCustomLanguageData(languages[0])

	publishTranslatesToDash(translates, defaultTranslates)
	dispatch(TranslationAction.isFetchingTranslations(false))
}

type TranslationActionType = typeof TranslationAction
