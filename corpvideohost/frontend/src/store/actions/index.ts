import * as VideoActions from './videoActions'
import * as SettingsAction from './settingsActions'
import * as UserAction from './userActions'

export default {
    ...VideoActions,
    ...SettingsAction,
    ...UserAction,
}
