export interface Video {
    id: number
    title: string
    description: string
    upload_date: string
    video: string
    status: string
    creator: number
    favorited_by_user: boolean
}

export interface VideoState {
    videos: Video[] | null
    searchTerm: string
    currentVideo: Video | null
}

export enum VideoActionTypes {
    FETCH_VIDEO_LIST_SUCCESS = 'FETCH_VIDEO_LIST_SUCCESS',
    FETCH_VIDEO_SUCCESS = 'FETCH_VIDEO_SUCCESS',
    ADD_VIDEO = 'ADD_VIDEO',
    DELETE_VIDEO = 'DELETE_VIDEO',
    SET_SEARCH_TERM = 'SET_SEARCH_TERM',
    FETCH_ALL_VIDEO_LIST_SUCCESS = 'FETCH_ALL_VIDEO_LIST_SUCCESS',
}

export interface FetchVideoListSuccessAction {
    type: VideoActionTypes.FETCH_VIDEO_LIST_SUCCESS
    payload: Video[]
}

export interface FetchAllVideoListSuccessAction {
    type: VideoActionTypes.FETCH_ALL_VIDEO_LIST_SUCCESS
    payload: Video[]
}

export interface FetchVideoSuccessAction {
    type: VideoActionTypes.FETCH_VIDEO_SUCCESS
    payload: Video
}
export interface AddVideoAction {
    type: VideoActionTypes.ADD_VIDEO
    payload: Video
}
export interface DeleteVideoAction {
    type: VideoActionTypes.DELETE_VIDEO
    payload: number
}

export interface SetSearchTermAction {
    type: VideoActionTypes.SET_SEARCH_TERM
    payload: string
}

export type VideoAction =
    | FetchVideoListSuccessAction
    | FetchAllVideoListSuccessAction
    | FetchVideoSuccessAction
    | AddVideoAction
    | DeleteVideoAction
    | SetSearchTermAction
