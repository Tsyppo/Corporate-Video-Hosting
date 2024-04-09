import {
    SettingsAction,
    SettingsActionType,
    SettingsState,
} from '../../types/settings'

const initialState: SettingsState = {
    theme: 'light',
    language: 'en',
}

const settingsReducer = (
    state = initialState,
    action: SettingsAction,
): SettingsState => {
    switch (action.type) {
        case SettingsActionType.CHANGE_THEME:
            return {
                ...state,
                theme: action.payload,
            }
        case SettingsActionType.CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.payload,
            }
        default:
            return state
    }
}

export default settingsReducer
