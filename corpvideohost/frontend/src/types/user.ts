export interface User {
    id: number
    email: string
    username: string
    first_name: string
    last_name: string
    patronymic: string
    phone_number: string
    avatar: string | null
    role: UserRole
    status: UserStatus
    registration_date: Date
}

export interface UserState {
    user: User | null
    loading: boolean
    error: string | null
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum UserActionTypes {
    FETCH_USER_REQUEST = 'FETCH_USER_REQUEST',
    FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS',
    FETCH_USER_FAILURE = 'FETCH_USER_FAILURE',
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

export interface LogoutUserAction {
    type: UserActionTypes.LOGOUT_USER
}

export type UserAction =
    | UserRequestAction
    | UserSuccessAction
    | UserFailureAction
    | LogoutUserAction
