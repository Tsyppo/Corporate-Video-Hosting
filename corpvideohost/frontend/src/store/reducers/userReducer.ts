import { UserState, UserAction, UserActionTypes } from '../../types/user'

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
}

const userReducer = (state = initialState, action: UserAction): UserState => {
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
