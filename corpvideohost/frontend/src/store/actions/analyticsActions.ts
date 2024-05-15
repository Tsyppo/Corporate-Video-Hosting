import axios from 'axios'
import { Dispatch } from 'redux'
import { AnalyticsActionTypes, AnalyticsAction } from '../../types/analytics'

// Action для получения аналитики
export const fetchAnalytics = () => {
    return async (dispatch: Dispatch<AnalyticsAction>) => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/analytics/',
            )
            dispatch({
                type: AnalyticsActionTypes.FETCH_ANALYTICS_LIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error fetching analytics:', error)
            // Можно добавить обработку ошибки здесь, если нужно
        }
    }
}

// Action для добавления новой аналитики
export const addAnalytics = (newAnalytics: any) => {
    return async (dispatch: Dispatch<AnalyticsAction>) => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/analytics/',
                newAnalytics,
            )
            dispatch({
                type: AnalyticsActionTypes.ADD_ANALYTICS_LIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error adding analytics:', error)
            // Можно добавить обработку ошибки здесь, если нужно
        }
    }
}

export const updateAnalytics = (analyticsId: number, updatedAnalytics: any) => {
    return async (dispatch: Dispatch<AnalyticsAction>) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/analytics/${analyticsId}/`,
                updatedAnalytics,
            )
            dispatch({
                type: AnalyticsActionTypes.UPDATE_ANALYTICS_LIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error updating analytics:', error)
        }
    }
}
