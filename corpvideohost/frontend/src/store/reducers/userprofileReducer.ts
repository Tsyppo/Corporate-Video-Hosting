import {
    UserProfile,
    UserProfileAction,
    UserProfileActionTypes,
    UserProfileState,
} from '../../types/userprofile'

const initialState: UserProfileState = {
    userProfiles: null,
    userProfile: null,
    loading: false,
    error: null,
}

export const userProfileReducer = (
    state = initialState,
    action: UserProfileAction,
): UserProfileState => {
    switch (action.type) {
        case UserProfileActionTypes.FETCH_USERPROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case UserProfileActionTypes.FETCH_USERPROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                userProfile: action.payload,
            }
        case UserProfileActionTypes.FETCH_USERPROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case UserProfileActionTypes.FETCH_USERPROFILE_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                userProfiles: action.payload,
            }
        case UserProfileActionTypes.UPDATE_USERPROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case UserProfileActionTypes.UPDATE_USERPROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                userProfile: action.payload,
            }
        case UserProfileActionTypes.UPDATE_USERPROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}
