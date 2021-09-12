import { AccountStatus } from '@smartsupp/websocket-client'

import { State } from 'store/combinedReducers'
import { chatStatus } from 'store/general/selectors'

import { getSsWidget } from 'utils/sdk'
import { filterUserAgentMessages } from 'utils/messageHelpers'
import { ChatStatus } from 'model/Enums'

export const hideWidgetIfAgentIsOffline = (state: State): boolean | undefined =>
	getSsWidget().options?.hideOfflineChat &&
	state.agent.status === AccountStatus.Offline &&
	filterUserAgentMessages(state.messages.messages).length === 0 &&
	state.messages.inputText.length === 0 &&
	chatStatus(state) !== ChatStatus.Pending &&
	!getSsWidget().options?.isPreviewMode

// Widget should not be hidden for certain chat statuses
export const displayWidgetBasedOnChatStatus = (state: State): boolean =>
	chatStatus(state) === ChatStatus.Opened ||
	chatStatus(state) === ChatStatus.Served ||
	chatStatus(state) === ChatStatus.ClosedByVisitor ||
	chatStatus(state) === ChatStatus.Resolved
