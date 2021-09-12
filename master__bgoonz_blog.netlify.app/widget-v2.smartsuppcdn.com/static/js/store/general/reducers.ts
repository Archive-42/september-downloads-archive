import { reducer } from 'ts-action'
import { on } from 'ts-action-immer'
import { IVisitorConnectedData } from '@smartsupp/websocket-client'

import { GeneralAction as Action } from 'store/general/actions'
import { LoadingState, ChatStatus } from 'model/Enums'
import { FormDropDown, FormInput, FormTextCheckbox } from 'model/FormInput'
import { getSsWidget } from 'utils/sdk'
import { getParentWindowSize } from 'utils/resizer'
import { generateTheme } from 'utils/theme/themeGenerator'
import { generateAuthFormInputs } from 'utils/authFormHelper'
import { getDataFromLocalStorage } from 'utils/cookie'
import { storageOpenName } from 'constants/cookies'

export const initialState = {
	requestState: LoadingState.Loading,
	isWidgetOpen: getDataFromLocalStorage()[storageOpenName] === 'true',
	theme: generateTheme(),
	userData: undefined as IVisitorConnectedData | undefined,
	parentSize: getParentWindowSize(),
	isWidgetOnline: true,
	isInputFocused: false,
	showMorePopper: false,
	authFormState: false,
	dataPrivacyState: false,
	authFormInputs: generateAuthFormInputs([], undefined) as FormInput[] | FormDropDown[] | FormTextCheckbox[],
	isWidgetHidden: getSsWidget().options?.hideWidget ?? true,
	isWidgetOpening: false,
	isWidgetLoaded: false,
	closeModalOpenedState: false,
	chatStatus: undefined as ChatStatus | undefined,
	documentFocus: false,
	openOnTrigger: getSsWidget().options?.openOnTrigger,
}

export type GeneralState = typeof initialState

export const generalReducer = reducer<GeneralState>(
	initialState,
	on(Action.setRequestState, (state: GeneralState, { payload }) => {
		state.requestState = payload
	}),
	on(Action.widgetOpen, state => {
		state.isWidgetOpen = true
	}),
	on(Action.widgetClose, state => {
		state.showMorePopper = false
		if (state.isWidgetOpen) {
			state.isInputFocused = false
		}
		state.isWidgetOpen = false
	}),
	on(Action.setUser, (state: GeneralState, { payload }) => {
		state.userData = payload
	}),
	on(Action.widgetLoadedToggle, state => {
		state.isWidgetLoaded = !state.isWidgetLoaded
	}),
	on(Action.widgetOpeningToggle, state => {
		state.isWidgetOpening = !state.isWidgetOpening
	}),
	on(Action.dataPrivacyStateToggle, state => {
		state.dataPrivacyState = !state.dataPrivacyState
	}),
	on(Action.setThemeColor, (state: GeneralState, { payload }) => {
		state.theme = generateTheme(payload)
	}),
	on(Action.updateUserStatus, (state: GeneralState, { payload }) => {
		if (state.userData) {
			state.userData = { ...state.userData, account: { ...state.userData.account, status: payload } }
		}
	}),
	on(Action.updateUser, (state: GeneralState, { payload }) => {
		if (state.userData) {
			state.userData = { ...state.userData, visitor: { ...state.userData.visitor, ...payload } }
		}
	}),
	on(Action.authFormStateToggle, state => {
		state.authFormState = !state.authFormState
	}),
	on(Action.createAuthFormInputs, (state: GeneralState, { payload }) => {
		state.authFormInputs = payload
	}),
	on(Action.setSize, (state: GeneralState, { payload }): void => {
		state.parentSize = payload
	}),
	on(Action.widgetHide, state => {
		state.isWidgetHidden = true
	}),
	on(Action.widgetShow, state => {
		state.isWidgetHidden = false
	}),
	on(Action.widgetOffline, state => {
		state.isWidgetOnline = false
	}),
	on(Action.widgetOnline, state => {
		state.isWidgetOnline = true
	}),
	on(Action.setAuthFormInput, (state: GeneralState, { payload }) => {
		const { name, value } = payload
		const foundInput = state.authFormInputs.find(input => input.name === name)

		if (!foundInput) {
			console.error('Input in auth not found')
			return
		}

		foundInput.value = value
	}),
	on(Action.inputFocusToggle, state => {
		state.isInputFocused = !state.isInputFocused
	}),
	on(Action.showMorePopperClose, state => {
		state.showMorePopper = false
	}),
	on(Action.showMorePopperToggle, state => {
		state.showMorePopper = !state.showMorePopper
	}),
	on(Action.closeConversationModalToggle, state => {
		state.closeModalOpenedState = !state.closeModalOpenedState
	}),
	on(Action.setChatStatus, (state: GeneralState, { payload }) => {
		state.chatStatus = payload
	}),
	on(Action.documentFocusToggle, state => {
		state.documentFocus = !state.documentFocus
	}),
)
