import { Dispatch } from 'redux'
import axios from 'axios'
import {
    UserProfile,
    UserProfileAction,
    UserProfileActionTypes,
} from '../../types/userprofile'

// Действие для получения профиля пользователя по его идентификатору
export const fetchUserProfile = (userId: number) => {
    return async (dispatch: Dispatch<UserProfileAction>) => {
        dispatch({ type: UserProfileActionTypes.FETCH_USERPROFILE_REQUEST })
        try {
            const response = await axios.get<UserProfile>(
                `http://127.0.0.1:8000/api/userprofiles/${userId}/`,
            )
            dispatch({
                type: UserProfileActionTypes.FETCH_USERPROFILE_SUCCESS,
                payload: response.data,
            })
        } catch (eror) {
            dispatch({
                type: UserProfileActionTypes.FETCH_USERPROFILE_FAILURE,
                payload: `Ошибка доступа к профилю ${userId}`,
            })
        }
    }
}

// Действие для получения списка пользователей
export const fetchUserList = () => {
    return async (dispatch: Dispatch<UserProfileAction>) => {
        dispatch({ type: UserProfileActionTypes.FETCH_USERPROFILE_REQUEST })
        try {
            const response = await axios.get<UserProfile[]>(
                'http://127.0.0.1:8000/api/userprofiles/',
            )
            dispatch({
                type: UserProfileActionTypes.FETCH_USERPROFILE_LIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            dispatch({
                type: UserProfileActionTypes.FETCH_USERPROFILE_FAILURE,
                payload: `Ошибка доступа к списку профилей`,
            })
        }
    }
}

export const updateUserProfile = (userId: number, videoId: number) => {
    return async (dispatch: Dispatch<UserProfileAction>) => {
        dispatch({ type: UserProfileActionTypes.UPDATE_USERPROFILE_REQUEST })
        try {
            const response = await axios.patch<UserProfile>(
                `http://127.0.0.1:8000/api/userprofiles/${userId}/`,
                { videoId },
            )
            dispatch({
                type: UserProfileActionTypes.UPDATE_USERPROFILE_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            dispatch({
                type: UserProfileActionTypes.UPDATE_USERPROFILE_FAILURE,
                payload: `Ошибка при обновлении профиля ${userId}`,
            })
        }
    }
}
