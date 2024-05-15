import axios from 'axios'
import { Dispatch } from 'redux'
import { Video, VideoAction, VideoActionTypes } from '../../types/video'

export const fetchVideoListUser = (user: number) => {
    return async (dispatch: Dispatch<VideoAction>) => {
        try {
            const response = await axios.get<Video[]>(
                `http://127.0.0.1:8000/api/videos/?user=${user}`,
            )
            dispatch({
                type: VideoActionTypes.FETCH_VIDEO_LIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error fetching video list:', error)
        }
    }
}

export const fetchVideoList = () => {
    return async (dispatch: Dispatch<VideoAction>) => {
        try {
            const response = await axios.get<Video[]>(
                `http://127.0.0.1:8000/api/allvideos/`,
            )
            dispatch({
                type: VideoActionTypes.FETCH_ALL_VIDEO_LIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error fetching video list:', error)
        }
    }
}

export const fetchVideo = (video: number) => {
    return async (dispatch: Dispatch<VideoAction>) => {
        try {
            const response = await axios.get<Video>(
                `http://127.0.0.1:8000/api/videos/${video}`,
            )
            dispatch({
                type: VideoActionTypes.FETCH_VIDEO_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error fetching video:', error)
        }
    }
}

export const uploadVideo = (formData: FormData, user: number) => {
    return async (dispatch: Dispatch<VideoAction>) => {
        try {
            const response = await axios.post<Video>(
                `http://127.0.0.1:8000/api/videos/?user=${user}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            dispatch({
                type: VideoActionTypes.ADD_VIDEO,
                payload: response.data,
            })
            console.log('Video uploaded successfully')
        } catch (error) {
            console.error('Error uploading video:', error)
        }
    }
}

export const deleteVideo = (videoId: number) => {
    return async (dispatch: Dispatch<VideoAction>) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/videos/${videoId}/`)
            dispatch({
                type: VideoActionTypes.DELETE_VIDEO,
                payload: videoId,
            })
            console.log('Video deleted successfully')
        } catch (error) {
            console.error('Error deleting video:', error)
        }
    }
}

export const setSearchTerm = (searchTerm: string) => {
    return (dispatch: Dispatch<VideoAction>) => {
        dispatch({
            type: VideoActionTypes.SET_SEARCH_TERM,
            payload: searchTerm,
        })
    }
}
