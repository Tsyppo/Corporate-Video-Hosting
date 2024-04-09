import axios from 'axios'
import { Dispatch } from 'redux'
import { UserActionTypes, UserAction, User } from '../../types/user'

export const loginUser = (username: string, password: string) => {
    return async (dispatch: Dispatch<UserAction>) => {
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
                    payload: response.data,
                })
                window.location.assign('http://localhost:3000/main')
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
        // Удаление токена из локального хранилища
        localStorage.removeItem('token')
        window.location.assign('http://localhost:3000/login')
        // Очистка информации о пользователе из состояния Redux
        dispatch({ type: UserActionTypes.LOGOUT_USER })

        // Дополнительные шаги, если необходимо
    }
}
