import { VideoAction, VideoState, VideoActionTypes } from '../../types/video'

const initialState: VideoState = {
	videos: null,
}

export const videoReducer = (
	state = initialState,
	action: VideoAction
): VideoState => {
	switch (action.type) {
		case VideoActionTypes.FETCH_VIDEO_LIST_SUCCESS:
			return {
				...state,
				videos: action.payload,
			}
		default:
			return state
	}
}
