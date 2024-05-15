export interface Analytics {
    id: number
    user: number
    video: number
    view_date: string
    duration: string
    full_duration: string
    status: string
}

export interface AnalyticsState {
    analytics: Analytics[] | null
    analytic: Analytics | null
}

export enum AnalyticsActionTypes {
    FETCH_ANALYTICS_LIST_SUCCESS = 'FETCH_ANALYTICS_LIST_SUCCESS',
    ADD_ANALYTICS_LIST_SUCCESS = 'ADD_ANALYTICS_LIST_SUCCESS',
    UPDATE_ANALYTICS_LIST_SUCCESS = 'UPDATE_ANALYTICS_LIST_SUCCESS',
    DELETE_ANALYTICS_LIST_SUCCESS = 'DELETE_ANALYTICS_LIST_SUCCESS',
    FETCH_ANALYTICS_SUCCESS = 'FETCH_ANALYTICS_SUCCESS',
    ADD_ANALYTICS_SUCCESS = 'ADD_ANALYTICS_SUCCESS',
    UPDATE_ANALYTICS_SUCCESS = 'UPDATE_ANALYTICS_SUCCESS',
    DELETE_ANALYTICS_SUCCESS = 'DELETE_ANALYTICS_SUCCESS',
    UPDATE_ANALYTICS_DURATION = 'UPDATE_ANALYTICS_DURATION',
}

export interface FetchAnalyticssListSuccessAction {
    type: AnalyticsActionTypes.FETCH_ANALYTICS_LIST_SUCCESS
    payload: Analytics[]
}

export interface AddAnalyticsListSuccessAction {
    type: AnalyticsActionTypes.ADD_ANALYTICS_LIST_SUCCESS
    payload: Analytics
}

export interface UpdateAnalyticsListSuccessAction {
    type: AnalyticsActionTypes.UPDATE_ANALYTICS_LIST_SUCCESS
    payload: Analytics
}

export interface DeleteAnalyticsListSuccessAction {
    type: AnalyticsActionTypes.DELETE_ANALYTICS_LIST_SUCCESS
    payload: number
}

export interface FetchAnalyticssSuccessAction {
    type: AnalyticsActionTypes.FETCH_ANALYTICS_SUCCESS
    payload: Analytics
}

export interface AddAnalyticsSuccessAction {
    type: AnalyticsActionTypes.ADD_ANALYTICS_SUCCESS
    payload: Analytics
}

export interface UpdateAnalyticsSuccessAction {
    type: AnalyticsActionTypes.UPDATE_ANALYTICS_SUCCESS
    payload: Analytics
}

export interface DeleteAnalyticsSuccessAction {
    type: AnalyticsActionTypes.DELETE_ANALYTICS_SUCCESS
    payload: number
}

export interface UpdateAnalyticsDurationSuccessAction {
    type: AnalyticsActionTypes.UPDATE_ANALYTICS_DURATION
    payload: Analytics
}

export type AnalyticsAction =
    | FetchAnalyticssListSuccessAction
    | AddAnalyticsListSuccessAction
    | UpdateAnalyticsListSuccessAction
    | DeleteAnalyticsListSuccessAction
    | FetchAnalyticssSuccessAction
    | AddAnalyticsSuccessAction
    | UpdateAnalyticsSuccessAction
    | DeleteAnalyticsSuccessAction
