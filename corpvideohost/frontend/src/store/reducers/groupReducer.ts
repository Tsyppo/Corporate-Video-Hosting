import { Reducer } from 'redux'
import { GroupState, GroupAction, GroupActionTypes } from '../../types/group'

const initialState: GroupState = {
    groups: null,
    searchTerm: '',
}

const groupReducer: Reducer<GroupState, GroupAction> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case GroupActionTypes.FETCH_GROUP_LIST_SUCCESS:
            return {
                ...state,
                groups: action.payload,
            }
        case GroupActionTypes.ADD_GROUP:
            return {
                ...state,
                groups: state.groups
                    ? [...state.groups, action.payload]
                    : [action.payload],
            }
        case GroupActionTypes.DELETE_GROUP:
            return {
                ...state,
                groups: state.groups
                    ? state.groups.filter(
                          (group) => group.id !== action.payload,
                      )
                    : null,
            }
        case GroupActionTypes.UPDATE_GROUP:
            return {
                ...state,
                groups: state.groups
                    ? state.groups.map((group) =>
                          group.id === action.payload.id
                              ? action.payload
                              : group,
                      )
                    : null,
            }
        case GroupActionTypes.SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload,
            }
        default:
            return state
    }
}

export default groupReducer
