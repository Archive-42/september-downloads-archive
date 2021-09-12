import { applyMiddleware, createStore, Store } from 'redux'
import thunk from 'redux-thunk'

import { reducer, State } from './combinedReducers'

// let middleware: any[] = [thunk]
//
// if (process.env.NODE_ENV !== 'production') {
// 	const { logger } = require(`redux-logger`) // eslint-disable-line
// 	middleware = [...middleware, logger]
// }

const store: Store = createStore<State, any, any, any>(reducer, applyMiddleware(thunk))

export default store
