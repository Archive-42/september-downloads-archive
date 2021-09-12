import { createSelector } from 'reselect'
import { IVisitorConnectedData } from '@smartsupp/websocket-client'

import { State } from 'store/combinedReducers'
import { inputText, getMessages, lastUnreadTriggers, showTriggerTypingAnimation } from 'store/messages/selectors'
import { displayWidgetBasedOnChatStatus, hideWidgetIfAgentIsOffline } from 'store/general/utils'
import { FormDropDown, FormInput, FormTextCheckbox } from 'model/FormInput'
import { SmartTheme } from 'model/Theme'
import { ButtonStyle } from 'model/ChatPosition'
import { ChatStatus } from 'model/Enums'
import { getSsWidget } from 'utils/sdk'
import { filterUserAgentMessages } from 'utils/messageHelpers'
import { WindowSize } from 'utils/resizer'
import { secretDebug } from 'utils/debug'
import {
	BREAKPOINT_MD,
	BREAKPOINT_HEIGHT_MD,
	TABLET_MIN_THRESHOLD,
	TABLET_MAX_THRESHOLD,
} from 'constants/breakpointConstants'

const isWidgetFocused = (state: State): boolean => state.general.documentFocus
const openOnTrigger = (state: State): boolean => state.general.openOnTrigger
const parentSize = (state: State): WindowSize => state.general.parentSize
const isPrivacyShown = (state: State) => state.general.dataPrivacyState

export const isWidgetOpen = (state: State): boolean => state.general.isWidgetOpen
export const enableSounds = (state: State): boolean => state.messages.enableSounds
export const theme = (state: State): SmartTheme => state.general.theme
export const isWidgetOpening = (state: State): boolean => state.general.isWidgetOpening
export const authFormInputs = (state: State): FormInput[] | FormDropDown[] | FormTextCheckbox[] =>
	state.general.authFormInputs
export const chatStatus = (state: State): ChatStatus | undefined => state.general.chatStatus
export const isAuthFormShown = (state: State): boolean =>
	state.general.authFormState && !isUserAuthenticated(state) && authFormInputs(state).length > 0
export const isCloseModalOpened = (state: State): boolean => state.general.closeModalOpenedState
export const isWidgetLoaded = (state: State): boolean => state.general.isWidgetLoaded
export const isWidgetVisible = (state: State): boolean => {
	if (state.general.userData?.visitor.bannedAt) return false
	if (displayWidgetBasedOnChatStatus(state)) return true
	if (hideWidgetIfAgentIsOffline(state)) return false
	if (isWidgetMobile(state) && getSsWidget().options?.hideMobileWidget) return false

	return !state.general.isWidgetHidden
}

export const userData = (state: State): IVisitorConnectedData | undefined => state.general.userData

export const isIE = createSelector(userData, userInfo => {
	if (userInfo && userInfo.browser) {
		return userInfo.browser.isIE
	}
	return true
})

export const isWidgetMobile = createSelector(parentSize, userData, isIE, (parSize, userInfo, ie) => {
	const isPortrait = parSize.height > parSize.width

	if (userInfo && userInfo.browser) {
		const { isTablet, isMobile } = userInfo.browser
		if (ie) {
			return false
		}

		if (isTablet) {
			return !isPortrait
		}

		if (isMobile) {
			return true
		}
	}

	return parSize.width < BREAKPOINT_MD || parSize.height < BREAKPOINT_HEIGHT_MD
})

export const isUserAuthenticated = createSelector(userData, item => {
	// Check if variables include authenticated
	const isAuthedByBE = Boolean(item?.visitor?.variables?.authenticated)
	const authVariable = item?.visitor?.variables?.authenticated
	secretDebug('authVariable should show auth form', typeof authVariable, authVariable, 'item.visitor', item)
	return isAuthedByBE
})

export const isWidgetOnline = (state: State) => state.general.isWidgetOnline
export const isInputFocused = (state: State) => state.general.isInputFocused
export const showMorePopper = (state: State) => state.general.showMorePopper

export const isBubbleOrGreeting = (state: State) => {
	const { buttonStyle } = getSsWidget().options
	return isWidgetMobile(state) ? ButtonStyle.Bubble : buttonStyle
}

export const isWidgetDesktop = createSelector(userData, userInfo => {
	const isPc = !!(userInfo && userInfo.browser && userInfo.browser.isDesktop)
	let isTabletByWidth

	try {
		isTabletByWidth = window.screen.width > TABLET_MIN_THRESHOLD && window.screen.width < TABLET_MAX_THRESHOLD
	} catch (error) {
		isTabletByWidth = undefined
	}

	secretDebug('window', window.screen.width)
	secretDebug('is device tablet by width', isTabletByWidth)
	const tabletByWidth = !!isTabletByWidth
	return isPc && !tabletByWidth
})

export const showHeaderCloseButton = createSelector(
	isWidgetMobile,
	isInputFocused,
	isAuthFormShown,
	(mobile, focused, auth) => mobile && focused && !auth,
)

export const showSendIcon = createSelector(
	inputText,
	isAuthFormShown,
	getMessages,
	(textInput, authShown, msgs) =>
		(textInput && textInput.trim().length > 0) || authShown || filterUserAgentMessages(msgs).length === 0,
)

export const showTrigger = createSelector(
	isWidgetOpen,
	isWidgetMobile,
	lastUnreadTriggers,
	showTriggerTypingAnimation,
	(isOpen, isMobile, unreadTriggers, fakeTyping) => !isOpen && !isMobile && (unreadTriggers.length > 0 || fakeTyping),
)

export const shouldPlaySound = createSelector(
	enableSounds,
	isWidgetVisible,
	isWidgetFocused,
	isWidgetOpen,
	(enableSounds, isWidgetVisible, isWidgetFocused, isWidgetOpen) =>
		enableSounds && isWidgetVisible && !(isWidgetFocused && isWidgetOpen),
)

export const isBackdropDisplayed = createSelector(
	isAuthFormShown,
	isPrivacyShown,
	isCloseModalOpened,
	(isAuthFormShown, isPrivacyShown, isCloseModalOpened) => isAuthFormShown || isPrivacyShown || isCloseModalOpened,
)

export const isPrivacyDisplayed = createSelector(
	isPrivacyShown,
	isCloseModalOpened,
	(isPrivacyShown, isCloseModalOpened) => isPrivacyShown && !isCloseModalOpened,
)
export const openWidgetOnTrigger = createSelector(
	openOnTrigger,
	isWidgetMobile,
	(openOnTrigger, isWidgetMobile) => openOnTrigger && !isWidgetMobile,
)
