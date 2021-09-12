import { Group, IVisitorIdentity } from '@smartsupp/websocket-client'
import { FormInput, FormInputType, phoneRegex } from '../model/FormInput'
import { getSsWidget } from './sdk'
import { TranslationService as T } from './TranslationService'

export const personalDataProcessingConsentName = 'personalDataProcessingConsent'
export const addPersonalDataProcessingToInputs = (
	authFormInputs: FormInput[],
	personalDataProcessingConsentFilled: boolean,
	privacyNoticeCheckRequired?: boolean,
	privacyNoticeEnabled?: boolean,
) =>
	(privacyNoticeEnabled && authFormInputs.length > 0 && !personalDataProcessingConsentFilled) ||
	(privacyNoticeEnabled && !personalDataProcessingConsentFilled && privacyNoticeCheckRequired)

export const generateAuthFormInputs = (groups: Group[] | undefined, visitor: IVisitorIdentity | undefined) => {
	const {
		nameControl,
		numberControl,
		emailControl,
		privacyNoticeCheckRequired,
		privacyNoticeEnabled,
		groupSelectEnabled,
	} = getSsWidget().options

	const visitorNameFilled = Boolean(visitor?.name)
	const visitorEmailFilled = Boolean(visitor?.email)
	const visitorGroupPreFilled = Boolean(visitor?.group)
	const visitorPhoneFilled = Boolean(visitor?.phone)
	const personalDataProcessingConsentFilled = Boolean(visitor?.variables?.personalDataProcessingConsent)

	const authFormInputs: FormInput[] = []

	if (emailControl && !visitorEmailFilled) {
		authFormInputs.unshift({
			type: FormInputType.Text,
			name: 'email',
			fullWidth: true,
			label: T.translate('authForm.yourEmail'),
			multiline: false,
			placeHolder: T.translate('authForm.yourEmail'),
			validations: ['required', 'isEmail'],
			value: '',
		})
	}

	if (nameControl && !visitorNameFilled) {
		authFormInputs.unshift({
			type: FormInputType.Text,
			name: 'name',
			fullWidth: true,
			label: T.translate('authForm.yourName'),
			multiline: false,
			placeHolder: T.translate('authForm.yourName'),
			validations: ['required'],
			value: '',
		})
	}

	if (numberControl && !visitorPhoneFilled) {
		authFormInputs.push({
			type: FormInputType.Text,
			name: 'phone',
			placeHolder: T.translate('authForm.yourPhone'),
			label: T.translate('authForm.yourPhone'),
			validations: ['required', phoneRegex.phone],
			multiline: false,
			fullWidth: true,
			value: '',
		})
	}

	const visitorGroup = visitor?.group

	if (groupSelectEnabled && groups && groups.length > 0) {
		authFormInputs.push({
			type: FormInputType.DropDown,
			name: 'group',
			fullWidth: true,
			label: '',
			multiline: false,
			placeHolder: T.translate('authForm.group'),
			validations: ['required'],
			value: visitorGroupPreFilled && visitorGroup ? visitorGroup : '',
			greyBg: true,
			choices: groups || [],
		})
	}

	if (
		addPersonalDataProcessingToInputs(
			authFormInputs,
			personalDataProcessingConsentFilled,
			privacyNoticeCheckRequired,
			privacyNoticeEnabled,
		)
	) {
		authFormInputs.push({
			type: FormInputType.Checkbox,
			name: personalDataProcessingConsentName,
			fullWidth: true,
			label: '',
			multiline: false,
			placeHolder: '',
			validations: privacyNoticeCheckRequired ? ['required'] : [],
			requiredCheck: !!privacyNoticeCheckRequired,
			value: '',
		})
	}

	return authFormInputs
}
