import { combineReducers } from 'redux'
import { videoReducer } from './videoReducer'
import settingsReducer from './settingsReducer'
import userReducer from './userReducer'
import groupReducer from './groupReducer'
import playlistReducer from './playlistReducer'
import commentReducer from './commentReducer'

export const rootReducer = combineReducers({
    user: userReducer,
    video: videoReducer,
    group: groupReducer,
    playlist: playlistReducer,
    comment: commentReducer,
    settings: settingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>
