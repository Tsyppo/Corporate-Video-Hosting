import axios from 'axios'
import { Dispatch } from 'redux'
import { Comment, CommentAction, CommentActionTypes } from '../../types/comment' // Предположим, что у вас есть тип Comment в файле comment.ts

export const fetchComments = (videoId: number) => {
    return async (dispatch: Dispatch<CommentAction>) => {
        try {
            const response = await axios.get<Comment[]>(
                `http://127.0.0.1:8000/api/comments/?video_id=${videoId}`,
            )
            dispatch({
                type: CommentActionTypes.FETCH_COMMENTS_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error fetching comments:', error)
            dispatch({
                type: CommentActionTypes.FETCH_COMMENTS_FAILURE,
                payload: 'Error fetching comments',
            })
        }
    }
}

export const addComment = (commentData: any) => {
    // Предполагается, что commentData содержит данные нового комментария
    return async (dispatch: Dispatch<CommentAction>) => {
        try {
            const response = await axios.post<Comment>(
                'http://127.0.0.1:8000/api/comments/',
                commentData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            dispatch({
                type: CommentActionTypes.ADD_COMMENT_SUCCESS,
                payload: response.data,
            })
            console.log('Comment added successfully')
        } catch (error) {
            console.error('Error adding comment:', error)
            dispatch({
                type: CommentActionTypes.ADD_COMMENT_FAILURE,
                payload: 'Error adding comment',
            })
        }
    }
}

export const updateComment = (commentData: any) => {
    return async (dispatch: Dispatch<CommentAction>) => {
        try {
            const response = await axios.put<Comment>(
                `http://127.0.0.1:8000/api/comments/${commentData.id}/`,
                commentData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            dispatch({
                type: CommentActionTypes.UPDATE_COMMENT_SUCCESS,
                payload: response.data,
            })
            console.log('Comment updated successfully')
        } catch (error) {
            console.error('Error updating comment:', error)
            dispatch({
                type: CommentActionTypes.UPDATE_COMMENT_FAILURE,
                payload: 'Error updating comment',
            })
        }
    }
}

export const deleteComment = (commentId: number) => {
    return async (dispatch: Dispatch<CommentAction>) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/comments/${commentId}/`,
            )
            dispatch({
                type: CommentActionTypes.DELETE_COMMENT_SUCCESS,
                payload: commentId,
            })
            console.log('Comment deleted successfully')
        } catch (error) {
            console.error('Error deleting comment:', error)
            dispatch({
                type: CommentActionTypes.DELETE_COMMENT_FAILURE,
                payload: 'Error deleting comment',
            })
        }
    }
}

export const setCommentLiked = (commentId: number, liked: boolean) => {
    return async (dispatch: Dispatch<CommentAction>) => {
        try {
            // Send request to update the liked status of the comment
            // Assuming there is an endpoint to handle this operation
            // You can modify this part according to your backend implementation
            console.log(`Comment ${commentId} liked status updated to ${liked}`)
        } catch (error) {
            console.error('Error updating comment liked status:', error)
        }
    }
}
