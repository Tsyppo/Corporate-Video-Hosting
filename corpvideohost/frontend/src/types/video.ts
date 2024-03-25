export interface Video {
	id: number
	title: string
	description: string
	upload_date: string
	video_url: string
	access_status: string
	favorited_by_user: boolean
}

export interface VideoState {
	videos: Video[] | null
}

export enum VideoActionTypes {
	FETCH_VIDEO_LIST_SUCCESS = 'FETCH_VIDEO_LIST_SUCCESS',
}

export interface FetchVideoListSuccessAction {
	type: VideoActionTypes.FETCH_VIDEO_LIST_SUCCESS
	payload: Video[]
}

export type VideoAction = FetchVideoListSuccessAction
