import { combineReducers } from 'redux'
import { videoReducer } from './videoReducer'
import settingsReducer from './settingsReducer'
import userReducer from './userReducer'

export const rootReducer = combineReducers({
    video: videoReducer,
    settings: settingsReducer,
    user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>
