import * as VideoActions from './videoActions'
import * as SettingsAction from './settingsActions'
import * as UserAction from './userActions'
import * as GroupAction from './groupActions'
import * as PlaylistAction from './playlistActions'
import * as CommentAction from './commentActions'

export default {
    ...VideoActions,
    ...SettingsAction,
    ...UserAction,
    ...GroupAction,
    ...PlaylistAction,
    ...CommentAction,
}
