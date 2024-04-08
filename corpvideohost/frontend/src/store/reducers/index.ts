import { combineReducers } from 'redux'
import { videoReducer } from './videoReducer'

export const rootReducer = combineReducers({
    video: videoReducer,
})

export type RootState = ReturnType<typeof rootReducer>
