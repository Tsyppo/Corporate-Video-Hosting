import { UserState, UserAction, UserActionTypes, User } from '../../types/user'

const initialState: UserState = {
    users: null,
    user: null,
    loading: false,
    error: null,
}

const userReducer = (state = initialState, action: UserAction): UserState => {
    let isValidUser: boolean // Moved declaration outside the switch statement

    switch (action.type) {
        case UserActionTypes.FETCH_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case UserActionTypes.FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            }
        case UserActionTypes.FETCH_USER_LIST_SUCCESS:
            return {
                ...state,
                users: action.payload,
                loading: false,
                error: null,
            }
        case UserActionTypes.FETCH_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

        default:
            return state
    }
}

export default userReducer
