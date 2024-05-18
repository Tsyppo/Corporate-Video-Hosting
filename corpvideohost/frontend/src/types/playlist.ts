export interface Playlist {
    id: number
    title: string
    status: string
    creation_date: string
    group: number
    videos: []
}

export interface PlaylistState {
    playlists: Playlist[] | null
    searchTerm: string
}

export enum PlaylistActionTypes {
    FETCH_PLAYLIST_LIST_SUCCESS = 'FETCH_PLAYLIST_LIST_SUCCESS',
    ADD_PLAYLIST = 'ADD_PLAYLIST',
    DELETE_PLAYLIST = 'DELETE_PLAYLIST',
    UPDATE_PLAYLIST = 'UPDATE_PLAYLIST',
    SET_SEARCH_TERM = 'SET_SEARCH_TERM',
}

export interface FetchPlaylistSuccessAction {
    type: PlaylistActionTypes.FETCH_PLAYLIST_LIST_SUCCESS
    payload: Playlist[]
}
export interface AddPlaylistAction {
    type: PlaylistActionTypes.ADD_PLAYLIST
    payload: Playlist
}

export interface UpdatePlaylistAction {
    type: PlaylistActionTypes.UPDATE_PLAYLIST
    payload: Playlist
}

export interface DeletePlaylistAction {
    type: PlaylistActionTypes.DELETE_PLAYLIST
    payload: number
}

export interface SetSearchTermAction {
    type: PlaylistActionTypes.SET_SEARCH_TERM
    payload: string
}

export type PlaylistAction =
    | FetchPlaylistSuccessAction
    | AddPlaylistAction
    | UpdatePlaylistAction
    | DeletePlaylistAction
    | SetSearchTermAction
