import axios from 'axios'
import { Dispatch } from 'redux'
import { UserActionTypes, UserAction, User } from '../../types/user'
import { RootState } from '../reducers'
import { useNavigate } from 'react-router-dom'

export const fetchListUser = () => {
    return async (dispatch: Dispatch<UserAction>) => {
        try {
            const response = await axios.get<User[]>(
                `http://127.0.0.1:8000/api/users/`,
            )
            dispatch({
                type: UserActionTypes.FETCH_USER_LIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error fetching user list:', error)
        }
    }
}

export const loginUser = (username: string, password: string) => {
    return async (
        dispatch: Dispatch<UserAction>,
        getState: () => RootState,
    ) => {
        // Добавляем getState
        dispatch({ type: UserActionTypes.FETCH_USER_REQUEST })

        try {
            const response = await axios.post<any>(
                'http://127.0.0.1:8000/api/login/',
                {
                    username: username,
                    password: password,
                },
            )
            if (response.status === 200) {
                localStorage.setItem('token', response.data.refresh)
                dispatch({
                    type: UserActionTypes.FETCH_USER_SUCCESS,
                    payload: response.data.id,
                })
                localStorage.setItem('user', JSON.stringify(response.data.id))
                window.location.href = '/main'
            } else {
                dispatch({
                    type: UserActionTypes.FETCH_USER_FAILURE,
                    payload: 'Ошибка авторизации пользователя',
                })
            }
        } catch (error) {
            dispatch({
                type: UserActionTypes.FETCH_USER_FAILURE,
                payload: 'Ошибка авторизации пользователя',
            })
        }
    }
}

export const loginUserSuccess = (token: string) => ({
    type: UserActionTypes.LOGIN_USER_SUCCESS,
    payload: token,
})

// Action creator для выполнения логаута
export const logoutUser = () => {
    return async (dispatch: Dispatch) => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.assign('http://localhost:3000/login')
        dispatch({ type: UserActionTypes.LOGOUT_USER })
    }
}
