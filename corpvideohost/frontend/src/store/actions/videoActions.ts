import axios from 'axios'
import { Dispatch } from 'redux'
import { Video, VideoAction, VideoActionTypes } from '../../types/video'

export const fetchVideoListSuccess = (videos: Video[]): VideoAction => ({
	type: VideoActionTypes.FETCH_VIDEO_LIST_SUCCESS,
	payload: videos,
})

export const fetchVideoList = () => async (dispatch: Dispatch<VideoAction>) => {
	try {
		const response = await axios.get<Video[]>(
			'http://127.0.0.1:8000/api/videos/'
		)
		dispatch(fetchVideoListSuccess(response.data))
	} catch (error) {
		console.error('Error fetching video list:', error)
	}
}
