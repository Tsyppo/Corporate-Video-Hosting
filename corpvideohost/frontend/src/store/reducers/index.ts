import { combineReducers } from 'redux'
import { videoReducer } from './videoReducer'
import settingsReducer from './settingsReducer'
import useReducer from './userReducer'

export const rootReducer = combineReducers({
    video: videoReducer,
    settings: settingsReducer,
    user: useReducer,
})

export type RootState = ReturnType<typeof rootReducer>
