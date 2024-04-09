export interface SettingsState {
    theme: 'light' | 'dark'
    language: 'en' | 'ru'
}

export enum SettingsActionType {
    CHANGE_THEME = 'CHANGE_THEME',
    CHANGE_LANGUAGE = 'CHANGE_LANGUAGE',
}

export interface ChangeThemeAction {
    type: SettingsActionType.CHANGE_THEME
    payload: 'light' | 'dark'
}

export interface ChangeLanguageAction {
    type: SettingsActionType.CHANGE_LANGUAGE
    payload: 'en' | 'ru'
}

export type SettingsAction = ChangeThemeAction | ChangeLanguageAction
