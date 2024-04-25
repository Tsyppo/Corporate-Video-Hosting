import axios from 'axios'
import { Dispatch } from 'redux'
import {
    Playlist,
    PlaylistAction,
    PlaylistActionTypes,
} from '../../types/playlist'

export const fetchPlaylistList = () => {
    return async (dispatch: Dispatch<PlaylistAction>) => {
        try {
            const response = await axios.get<Playlist[]>(
                `http://127.0.0.1:8000/api/playlists/`,
            )
            dispatch({
                type: PlaylistActionTypes.FETCH_PLAYLIST_LIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error fetching playlist:', error)
        }
    }
}

export const uploadPlaylist = (formData: FormData) => {
    return async (dispatch: Dispatch<PlaylistAction>) => {
        try {
            const response = await axios.post<Playlist>(
                'http://127.0.0.1:8000/api/playlists/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            dispatch({
                type: PlaylistActionTypes.ADD_PLAYLIST,
                payload: response.data,
            })
            console.log('Playlist uploaded successfully')
        } catch (error) {
            console.error('Error uploading playlist:', error)
        }
    }
}

export const deletePlaylist = (playlistId: number) => {
    return async (dispatch: Dispatch<PlaylistAction>) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/playlists/${playlistId}/`,
            )
            dispatch({
                type: PlaylistActionTypes.DELETE_PLAYLIST,
                payload: playlistId,
            })
            console.log('Playlist deleted successfully')
        } catch (error) {
            console.error('Error deleting playlist:', error)
        }
    }
}
