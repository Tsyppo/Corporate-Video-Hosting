import { createStore, applyMiddleware, Reducer } from 'redux'
import { thunk } from 'redux-thunk'
import { RootState, rootReducer } from './reducers'

export const store = createStore(
	rootReducer as unknown as Reducer<RootState>,
	applyMiddleware(thunk)
)
export type { RootState }
