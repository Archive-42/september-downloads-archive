import { combineReducers } from 'redux'

import * as general from './general/reducers'
import * as messages from './messages/reducers'
import * as agent from './agent/reducers'
import * as translation from './translations/reducers'

export interface State {
	general: general.GeneralState
	messages: messages.MessagesState
	agent: agent.AgentState
	translation: translation.TranslationState
}

export const initialState: State = {
	general: general.initialState,
	messages: messages.initialState,
	agent: agent.initialState,
	translation: translation.initialState,
}

export const reducer = combineReducers<State>({
	general: general.generalReducer,
	messages: messages.messagesReducer,
	agent: agent.agentReducer,
	translation: translation.translationReducer,
})
