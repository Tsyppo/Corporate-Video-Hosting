import { Reducer } from 'redux'
import {
    AnalyticsState,
    AnalyticsAction,
    AnalyticsActionTypes,
} from '../../types/analytics'

const initialState: AnalyticsState = {
    analytics: null,
    analytic: null,
}

const analyticsReducer: Reducer<AnalyticsState, AnalyticsAction> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case AnalyticsActionTypes.FETCH_ANALYTICS_LIST_SUCCESS:
            return {
                ...state,
                analytics: action.payload,
            }
        case AnalyticsActionTypes.ADD_ANALYTICS_LIST_SUCCESS:
            return {
                ...state,
                analytics: state.analytics
                    ? [...state.analytics, action.payload]
                    : [action.payload],
            }
        case AnalyticsActionTypes.UPDATE_ANALYTICS_LIST_SUCCESS:
            return {
                ...state,
                analytics: state.analytics
                    ? state.analytics.map((analytic) =>
                          analytic.id === action.payload.id
                              ? action.payload
                              : analytic,
                      )
                    : null,
            }
        case AnalyticsActionTypes.DELETE_ANALYTICS_LIST_SUCCESS:
            return {
                ...state,
                analytics: state.analytics
                    ? state.analytics.filter(
                          (analytic) => analytic.id !== action.payload,
                      )
                    : null,
            }
        case AnalyticsActionTypes.FETCH_ANALYTICS_SUCCESS:
            return {
                ...state,
                analytic: action.payload,
            }
        case AnalyticsActionTypes.ADD_ANALYTICS_SUCCESS:
            return {
                ...state,
                analytic: action.payload,
            }
        case AnalyticsActionTypes.UPDATE_ANALYTICS_SUCCESS:
            return {
                ...state,
                analytic: action.payload,
            }
        case AnalyticsActionTypes.DELETE_ANALYTICS_SUCCESS:
            return {
                ...state,
                analytic: null,
            }
        default:
            return state
    }
}

export default analyticsReducer
