export interface Video {
    id: number
    title: string
    description: string
    upload_date: string
    video: string
    access_status: string
    favorited_by_user: boolean
}

export interface VideoState {
    videos: Video[] | null
}

export enum VideoActionTypes {
    FETCH_VIDEO_LIST_SUCCESS = 'FETCH_VIDEO_LIST_SUCCESS',
    ADD_VIDEO = 'ADD_VIDEO',
    DELETE_VIDEO = 'DELETE_VIDEO',
}

export interface FetchVideoListSuccessAction {
    type: VideoActionTypes.FETCH_VIDEO_LIST_SUCCESS
    payload: Video[]
}
export interface AddVideoAction {
    type: VideoActionTypes.ADD_VIDEO
    payload: Video
}
export interface DeleteVideoAction {
    type: VideoActionTypes.DELETE_VIDEO
    payload: number // Идентификатор удаляемого видео
}
export type VideoAction =
    | FetchVideoListSuccessAction
    | AddVideoAction
    | DeleteVideoAction
