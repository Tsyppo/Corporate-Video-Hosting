import { VideoAction, VideoState, VideoActionTypes } from '../../types/video'

const initialState: VideoState = {
    videos: null,
    searchTerm: '',
}

export const videoReducer = (
    state = initialState,
    action: VideoAction,
): VideoState => {
    switch (action.type) {
        case VideoActionTypes.FETCH_VIDEO_LIST_SUCCESS:
            return {
                ...state,
                videos: action.payload,
            }
        case VideoActionTypes.ADD_VIDEO:
            return {
                ...state,
                videos: state.videos
                    ? [...state.videos, action.payload]
                    : [action.payload],
            }
        case VideoActionTypes.DELETE_VIDEO:
            return {
                ...state,
                videos: state.videos
                    ? state.videos.filter(
                          (video) => video.id !== action.payload,
                      )
                    : null,
            }
        case VideoActionTypes.SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload,
            }
        default:
            return state
    }
}
