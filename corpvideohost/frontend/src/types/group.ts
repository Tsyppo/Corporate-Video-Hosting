export interface Group {
    id: number
    title: string
    status: string
    description: string
    creation_date: string
    creator: number
    members: number[]
    waiting: number[]
    videos: []
    playlists: []
}

export interface GroupState {
    groups: Group[] | null
    searchTerm: string
}

export enum GroupActionTypes {
    FETCH_GROUP_LIST_SUCCESS = 'FETCH_GROUP_LIST_SUCCESS',
    ADD_GROUP = 'ADD_GROUP',
    DELETE_GROUP = 'DELETE_GROUP',
    UPDATE_GROUP = 'UPDATE_GROUP',
    SET_SEARCH_TERM = 'SET_SEARCH_TERM',
    APPLY_TO_GROUP = 'APPLY_TO_GROUP',
    CANCEL_APPLICATION = 'CANCEL_APPLICATION',
    ADD_TO_MEMBERS = 'ADD_TO_MEMBERS',
    DELETE_MEMBERS = 'DELETE_MEMBERS',
}

export interface FetchGroupListSuccessAction {
    type: GroupActionTypes.FETCH_GROUP_LIST_SUCCESS
    payload: Group[]
}
export interface AddGroupAction {
    type: GroupActionTypes.ADD_GROUP
    payload: Group
}
export interface DeleteGroupAction {
    type: GroupActionTypes.DELETE_GROUP
    payload: number
}

export interface UpdateGroupAction {
    type: GroupActionTypes.UPDATE_GROUP
    payload: Group
}

export interface SetSearchTermAction {
    type: GroupActionTypes.SET_SEARCH_TERM
    payload: string
}

export interface ApplyToGroupAction {
    type: GroupActionTypes.APPLY_TO_GROUP
    payload: Group
}

export interface CancelApplicationAction {
    type: GroupActionTypes.CANCEL_APPLICATION
    payload: Group
}

export interface AddToMembersAction {
    type: GroupActionTypes.ADD_TO_MEMBERS
    payload: Group
}

export interface DeleteMembersAction {
    type: GroupActionTypes.DELETE_MEMBERS
    payload: Group
}

export type GroupAction =
    | FetchGroupListSuccessAction
    | AddGroupAction
    | DeleteGroupAction
    | UpdateGroupAction
    | SetSearchTermAction
    | ApplyToGroupAction
    | CancelApplicationAction
    | AddToMembersAction
    | DeleteMembersAction
