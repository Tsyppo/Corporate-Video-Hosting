export interface Group {
    id: number
    title: string
    status: string
    description: string
    creation_date: string
    creator: number
    members: []
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

export type GroupAction =
    | FetchGroupListSuccessAction
    | AddGroupAction
    | DeleteGroupAction
    | UpdateGroupAction
    | SetSearchTermAction
