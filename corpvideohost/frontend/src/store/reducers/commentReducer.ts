import * as types from '../../types/comment'

const initialState: types.CommentState = {
    comments: null,
}

const commentsReducer = (
    state = initialState,
    action: types.CommentAction,
): types.CommentState => {
    switch (action.type) {
        case types.CommentActionTypes.FETCH_COMMENTS_SUCCESS:
            return {
                ...state,
                comments: action.payload,
            }
        case types.CommentActionTypes.ADD_COMMENT_SUCCESS:
            return {
                ...state,
                comments: state.comments
                    ? [...state.comments, action.payload]
                    : [action.payload],
            }
        case types.CommentActionTypes.UPDATE_COMMENT_SUCCESS:
            return {
                ...state,
                comments: state.comments
                    ? state.comments.map((comment) =>
                          comment.id === action.payload.id
                              ? action.payload
                              : comment,
                      )
                    : null,
            }
        case types.CommentActionTypes.DELETE_COMMENT_SUCCESS:
            return {
                ...state,
                comments: state.comments
                    ? state.comments.filter(
                          (comment) => comment.id !== action.payload,
                      )
                    : null,
            }
        case types.CommentActionTypes.FETCH_COMMENTS_FAILURE:
        case types.CommentActionTypes.ADD_COMMENT_FAILURE:
        case types.CommentActionTypes.UPDATE_COMMENT_FAILURE:
        case types.CommentActionTypes.DELETE_COMMENT_FAILURE:
            // Обработка ошибок может быть добавлена здесь
            return state
        default:
            return state
    }
}

export default commentsReducer
