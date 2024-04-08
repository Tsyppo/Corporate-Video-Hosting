import { VideoAction, VideoState, VideoActionTypes } from '../../types/video'

const initialState: VideoState = {
    videos: null,
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
            // Удаляем видео из списка по идентификатору
            return {
                ...state,
                videos: state.videos
                    ? state.videos.filter(
                          (video) => video.id !== action.payload,
                      )
                    : null,
            }
        default:
            return state
    }
}
