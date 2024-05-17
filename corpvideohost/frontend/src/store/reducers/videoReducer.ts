import { VideoAction, VideoState, VideoActionTypes } from '../../types/video'

const initialState: VideoState = {
    videos: null,
    searchTerm: '',
    currentVideo: null,
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
        case VideoActionTypes.FETCH_ALL_VIDEO_LIST_SUCCESS:
            return {
                ...state,
                videos: action.payload,
            }
        case VideoActionTypes.FETCH_VIDEO_SUCCESS:
            return {
                ...state,
                currentVideo: action.payload,
            }
        case VideoActionTypes.ADD_VIDEO:
            return {
                ...state,
                videos: state.videos
                    ? [...state.videos, action.payload]
                    : [action.payload],
            }
        case VideoActionTypes.UPDATE_VIDEO: // Добавленный кейс для обновления видео
            return {
                ...state,
                currentVideo: action.payload,
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
