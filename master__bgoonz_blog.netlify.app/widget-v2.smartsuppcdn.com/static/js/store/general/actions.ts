import { action, payload, Action } from 'ts-action'
import { Dispatch } from 'redux'
import { AccountStatus, IVisitorIdentity, IVisitorConnectedData, VisitorEventName } from '@smartsupp/websocket-client'

import { State } from 'store/combinedReducers'
import { generalSelectors } from 'store/general'
import { checkMessagesAndMarkAsRead, addRating } from 'store/messages/actions'
import { LoadingState, ChatStatus } from 'model/Enums'
import { FormInput } from 'model/FormInput'
import { WindowSize } from 'utils/resizer'
import { saveChatIsOpenToCookie } from 'utils/messageHelpers'
import { visitorClient } from 'utils/connect'
import { getSsWidget } from 'utils/sdk'
import { AppThunkAction } from 'types'
import { WIDGET_OPENING_TIME } from 'constants/animationConstants'
import { GET_WIDGET_WIDTH_TIMER } from 'constants/timeoutConstants'

export const GeneralAction = {
	authFormStateToggle: action('general/AUTH_FORM_STATE_TOGGLE'),
	closeConversationModalToggle: action('general/CLOSE_CONVERSATION_MODAL_TOGGLE'),
	createAuthFormInputs: action('general/CREATE_AUTH_FORM_INPUTS', payload<FormInput[]>()),
	dataPrivacyStateToggle: action('general/DATA_PRIVACY_STATE_TOGGLE'),
	documentFocusToggle: action('general/DOCUMENT_FOCUS_TOGGLE'),
	inputFocusToggle: action('general/INPUT_FOCUS_TOGGLE'),
	setAuthFormInput: action('general/SET_AUTH_FORM_INPUT', payload<{ name: string; value: string | boolean }>()),
	setChatStatus: action('general/SET_CHAT_STATE', payload<ChatStatus>()),
	setRequestState: action('general/SET_REQUEST_STATE', payload<LoadingState>()),
	setSize: action('general/SET_SIZE', payload<WindowSize>()),
	setThemeColor: action('general/SET_THEME_COLOR', payload<string>()),
	setUser: action('general/SET_USER', payload<IVisitorConnectedData>()),
	showMorePopperClose: action('general/SHOW_MORE_POPPER_CLOSE'),
	showMorePopperToggle: action('general/SHOW_MORE_POPPER_TOGGLE'),
	updateUser: action('general/UPDATE_USER', payload<Partial<IVisitorIdentity>>()),
	updateUserStatus: action('general/UPDATE_USER_STATUS', payload<AccountStatus>()),
	widgetHide: action('general/WIDGET_HIDE'),
	widgetShow: action('general/WIDGET_SHOW'),
	widgetLoadedToggle: action('general/WIDGET_LOADED_TOGGLE'),
	widgetOffline: action('general/WIDGET_OFFLINE'),
	widgetOnline: action('general/WIDGET_ONLINE'),
	widgetOpeningToggle: action('general/WIDGET_OPENING_TOGGLE'),
	widgetClose: action('general/WIDGET_OPEN'),
	widgetOpen: action('general/WIDGET_CLOSE'),
}

export const toggleOpenCloseWidget: AppThunkAction<GeneralAction> =
	(open: boolean, sendNotifyEvent = true) =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		dispatch(GeneralAction.widgetOpeningToggle())
		if (open) {
			dispatch(GeneralAction.widgetOpen())
			if (sendNotifyEvent) {
				visitorClient.client.notify(VisitorEventName.WidgetOpen)
			}
		} else {
			dispatch(GeneralAction.widgetClose())
		}
		dispatch(checkMessagesAndMarkAsRead(true))

		// Allows the widget to resize automatically according to text length
		dispatch(GeneralAction.widgetLoadedToggle())
		setTimeout(() => dispatch(GeneralAction.widgetLoadedToggle()), GET_WIDGET_WIDTH_TIMER)

		const allowSaveToCookie = generalSelectors.isWidgetDesktop(getState())

		if (allowSaveToCookie) {
			saveChatIsOpenToCookie(open)
		}

		// So that user cannot click the button by accident while opening chat
		setTimeout(() => {
			dispatch(GeneralAction.widgetOpeningToggle())
		}, WIDGET_OPENING_TIME)
	}

export const closeWidgetByCustomer: AppThunkAction<GeneralAction> =
	() =>
	async (dispatch: Dispatch<Action>): Promise<void> => {
		dispatch(GeneralAction.setChatStatus(ChatStatus.ClosedByVisitor))
		visitorClient.client.chatClose()
		if (getSsWidget().options?.ratingEnabled) {
			dispatch(addRating())
		} else {
			dispatch(GeneralAction.widgetClose())
		}
	}

export const showWidget: AppThunkAction<GeneralAction> =
	() =>
	async (dispatch: Dispatch<Action>, getState: () => State): Promise<void> => {
		dispatch(GeneralAction.widgetShow())
		if (generalSelectors.isWidgetVisible(getState())) {
			visitorClient.client.notify(VisitorEventName.WidgetShow)
		}
	}

export type GeneralAction = typeof GeneralAction
