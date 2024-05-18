import {
    PlaylistState,
    PlaylistAction,
    PlaylistActionTypes,
} from '../../types/playlist'

const initialState: PlaylistState = {
    playlists: null,
    searchTerm: '',
}

const playlistReducer = (
    state = initialState,
    action: PlaylistAction,
): PlaylistState => {
    switch (action.type) {
        case PlaylistActionTypes.FETCH_PLAYLIST_LIST_SUCCESS:
            return {
                ...state,
                playlists: action.payload,
            }
        case PlaylistActionTypes.ADD_PLAYLIST:
            return {
                ...state,
                playlists: state.playlists
                    ? [...state.playlists, action.payload]
                    : [action.payload],
            }
        case PlaylistActionTypes.DELETE_PLAYLIST:
            return {
                ...state,
                playlists: state.playlists
                    ? state.playlists.filter(
                          (playlist) => playlist.id !== action.payload,
                      )
                    : null,
            }
        case PlaylistActionTypes.UPDATE_PLAYLIST:
            return {
                ...state,
                playlists: state.playlists
                    ? state.playlists.map((playlist) =>
                          playlist.id === action.payload.id
                              ? action.payload
                              : playlist,
                      )
                    : null,
            }
        case PlaylistActionTypes.SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload,
            }
        default:
            return state
    }
}

export default playlistReducer
