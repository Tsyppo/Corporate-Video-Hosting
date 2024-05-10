export interface User {
    id: number
    email: string
    username: string
    first_name: string
    last_name: string
    patronymic: string
    phone_number: string
    avatar: string | null
    role: string
    status: string
    registration_date: Date
}

export interface UserState {
    users: User[] | null
    user: User | null
    loading: boolean
    error: string | null
}

export enum UserActionTypes {
    FETCH_USER_REQUEST = 'FETCH_USER_REQUEST',
    FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS',
    FETCH_USER_FAILURE = 'FETCH_USER_FAILURE',
    FETCH_USER_LIST_SUCCESS = 'FETCH_USER_LIST_SUCCESS',
    LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS',
    LOGOUT_USER = 'LOGOUT_USER',
}

export interface UserRequestAction {
    type: UserActionTypes.FETCH_USER_REQUEST
}

export interface UserSuccessAction {
    type: UserActionTypes.FETCH_USER_SUCCESS
    payload: User
}

export interface UserFailureAction {
    type: UserActionTypes.FETCH_USER_FAILURE
    payload: string
}

export interface FetchUserListSuccess {
    type: UserActionTypes.FETCH_USER_LIST_SUCCESS
    payload: User[]
}

export interface LogoutUserAction {
    type: UserActionTypes.LOGOUT_USER
}

export type UserAction =
    | UserRequestAction
    | UserSuccessAction
    | UserFailureAction
    | FetchUserListSuccess
    | LogoutUserAction
