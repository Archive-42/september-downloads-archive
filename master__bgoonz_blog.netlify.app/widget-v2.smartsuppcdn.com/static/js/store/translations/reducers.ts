import { reducer } from 'ts-action'
import { on } from 'ts-action-immer'
import { TranslationAction as Action } from './actions'

export const initialState = {
	isFetching: false,
}

export type TranslationState = typeof initialState

export const translationReducer = reducer<TranslationState>(
	initialState,
	on(Action.isFetchingTranslations, (state: TranslationState, { payload }) => {
		state.isFetching = payload
	}),
)
