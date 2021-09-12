import { State } from '../combinedReducers'

export const isTranslationFetching = (state: State): boolean => state.translation.isFetching
