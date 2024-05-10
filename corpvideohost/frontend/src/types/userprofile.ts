export interface UserProfile {
    id: number
    user: number
    favorites: number[]
    groups: []
    playlists: []
    search_history: []
}

export interface UserProfileState {
    userProfiles: UserProfile[] | null
    userProfile: UserProfile | null
    loading: boolean
    error: string | null
}

export enum UserProfileActionTypes {
    FETCH_USERPROFILE_REQUEST = 'FETCH_USERPROFILE_REQUEST',
    FETCH_USERPROFILE_SUCCESS = 'FETCH_USERPROFILE_SUCCESS',
    FETCH_USERPROFILE_FAILURE = 'FETCH_USERPROFILE_FAILURE',
    FETCH_USERPROFILE_LIST_SUCCESS = 'FETCH_USERPROFILE_LIST_SUCCESS',
    UPDATE_USERPROFILE_REQUEST = 'UPDATE_USERPROFILE_REQUEST',
    UPDATE_USERPROFILE_SUCCESS = 'UPDATE_USERPROFILE_SUCCESS',
    UPDATE_USERPROFILE_FAILURE = 'UPDATE_USERPROFILE_FAILURE',
}

export interface UserProfileRequestAction {
    type: UserProfileActionTypes.FETCH_USERPROFILE_REQUEST
}

export interface UserProfileSuccessAction {
    type: UserProfileActionTypes.FETCH_USERPROFILE_SUCCESS
    payload: UserProfile
}

export interface UserProfileFailureAction {
    type: UserProfileActionTypes.FETCH_USERPROFILE_FAILURE
    payload: string
}

export interface FetchUserprofileListSuccess {
    type: UserProfileActionTypes.FETCH_USERPROFILE_LIST_SUCCESS
    payload: UserProfile[]
}

export interface UpdateUserProfileRequestAction {
    type: UserProfileActionTypes.UPDATE_USERPROFILE_REQUEST
}

export interface UpdateUserProfileSuccessAction {
    type: UserProfileActionTypes.UPDATE_USERPROFILE_SUCCESS
    payload: UserProfile
}

export interface UpdateUserProfileFailureAction {
    type: UserProfileActionTypes.UPDATE_USERPROFILE_FAILURE
    payload: string
}

export type UserProfileAction =
    | UserProfileRequestAction
    | UserProfileSuccessAction
    | UserProfileFailureAction
    | FetchUserprofileListSuccess
    | UpdateUserProfileRequestAction
    | UpdateUserProfileSuccessAction
    | UpdateUserProfileFailureAction
