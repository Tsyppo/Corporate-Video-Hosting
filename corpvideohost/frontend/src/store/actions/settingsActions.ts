import {
    ChangeLanguageAction,
    ChangeThemeAction,
    SettingsActionType,
} from '../../types/settings'

export const changeTheme = (theme: 'light' | 'dark'): ChangeThemeAction => ({
    type: SettingsActionType.CHANGE_THEME,
    payload: theme,
})

export const changeLanguage = (
    language: 'en' | 'ru',
): ChangeLanguageAction => ({
    type: SettingsActionType.CHANGE_LANGUAGE,
    payload: language,
})
