export interface Comment {
    id: number
    text: string
    liked_by_user: boolean
    likes_count: number
    user: number // Assuming user is a number identifier
    video: number // Assuming video is a number identifier
    parent_comment?: number | null
    created_at: string // Assuming created_at is a string date
    username: string
}

export interface CommentState {
    comments: Comment[] | null
}

export enum CommentActionTypes {
    FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS',
    ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS',
    UPDATE_COMMENT_SUCCESS = 'UPDATE_COMMENT_SUCCESS',
    DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS',
    FETCH_COMMENTS_FAILURE = 'FETCH_COMMENTS_FAILURE',
    ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE',
    UPDATE_COMMENT_FAILURE = 'UPDATE_COMMENT_FAILURE',
    DELETE_COMMENT_FAILURE = 'DELETE_COMMENT_FAILURE',
}

export interface FetchCommentsSuccessAction {
    type: CommentActionTypes.FETCH_COMMENTS_SUCCESS
    payload: Comment[]
}

export interface AddCommentSuccessAction {
    type: CommentActionTypes.ADD_COMMENT_SUCCESS
    payload: Comment
}

export interface UpdateCommentSuccessAction {
    type: CommentActionTypes.UPDATE_COMMENT_SUCCESS
    payload: Comment
}

export interface DeleteCommentSuccessAction {
    type: CommentActionTypes.DELETE_COMMENT_SUCCESS
    payload: number // ID of the deleted comment
}

export interface FetchCommentsFailureAction {
    type: CommentActionTypes.FETCH_COMMENTS_FAILURE
    payload: string
}

export interface AddCommentFailureAction {
    type: CommentActionTypes.ADD_COMMENT_FAILURE
    payload: string
}

export interface UpdateCommentFailureAction {
    type: CommentActionTypes.UPDATE_COMMENT_FAILURE
    payload: string
}

export interface DeleteCommentFailureAction {
    type: CommentActionTypes.DELETE_COMMENT_FAILURE
    payload: string
}

export type CommentAction =
    | FetchCommentsSuccessAction
    | AddCommentSuccessAction
    | UpdateCommentSuccessAction
    | DeleteCommentSuccessAction
    | FetchCommentsFailureAction
    | AddCommentFailureAction
    | UpdateCommentFailureAction
    | DeleteCommentFailureAction
