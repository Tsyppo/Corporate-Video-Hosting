import axios from 'axios'
import { Dispatch } from 'redux'
import { Group, GroupAction, GroupActionTypes } from '../../types/group'

export const fetchGroupList = () => {
    return async (dispatch: Dispatch<GroupAction>) => {
        try {
            const response = await axios.get<Group[]>(
                `http://127.0.0.1:8000/api/groups/`,
            )
            dispatch({
                type: GroupActionTypes.FETCH_GROUP_LIST_SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            console.error('Error fetching group list:', error)
        }
    }
}

export const uploadGroup = (formData: FormData) => {
    return async (dispatch: Dispatch<GroupAction>) => {
        try {
            const response = await axios.post<Group>(
                'http://127.0.0.1:8000/api/groups/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            dispatch({
                type: GroupActionTypes.ADD_GROUP,
                payload: response.data,
            })
            console.log('Group uploaded successfully')
        } catch (error) {
            console.error('Error uploading group:', error)
        }
    }
}

export const applyToGroup = (groupId: number, waiting: number[]) => {
    return async (dispatch: Dispatch<GroupAction>) => {
        try {
            // Отправляем PATCH-запрос для обновления массива waiting
            const response = await axios.patch<Group>(
                `http://127.0.0.1:8000/api/groups/${groupId}/update-members-waiting/`,
                { waiting },
            )
            dispatch({
                type: GroupActionTypes.APPLY_TO_GROUP,
                payload: response.data,
            })
            console.log('Applied to group successfully')
        } catch (error) {
            console.error('Error applying to group:', error)
        }
    }
}

export const addToMembers = (groupId: number, userId: number) => {
    return async (dispatch: Dispatch<GroupAction>) => {
        try {
            // Отправляем PATCH-запрос для добавления пользователя в список members
            const response = await axios.patch<Group>(
                `http://127.0.0.1:8000/api/groups/${groupId}/add-to-members/`,
                { userId },
            )
            dispatch({
                type: GroupActionTypes.ADD_TO_MEMBERS,
                payload: response.data,
            })
            console.log('Added to members successfully')
        } catch (error) {
            console.error('Error adding to members:', error)
        }
    }
}

export const cancelApplication = (groupId: number, userId: number) => {
    return async (dispatch: Dispatch<GroupAction>) => {
        try {
            // Отправляем PATCH-запрос для удаления пользователя из списка ожидающих
            const response = await axios.patch<Group>(
                `http://127.0.0.1:8000/api/groups/${groupId}/cancel-application/${userId}/`,
            )
            dispatch({
                type: GroupActionTypes.CANCEL_APPLICATION,
                payload: response.data,
            })
            console.log('Cancelled application successfully')
        } catch (error) {
            console.error('Error cancelling application:', error)
        }
    }
}

export const updateGroup = (
    groupId: number,
    updatedGroupData: Partial<Group>,
) => {
    return async (dispatch: Dispatch<GroupAction>) => {
        try {
            const response = await axios.patch<Group>(
                `http://127.0.0.1:8000/api/groups/${groupId}/`,
                updatedGroupData,
            )
            dispatch({
                type: GroupActionTypes.UPDATE_GROUP,
                payload: response.data,
            })
            console.log('Group updated successfully')
        } catch (error) {
            console.error('Error updating group:', error)
        }
    }
}

export const deleteGroup = (groupId: number) => {
    return async (dispatch: Dispatch<GroupAction>) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/groups/${groupId}/`)
            dispatch({
                type: GroupActionTypes.DELETE_GROUP,
                payload: groupId,
            })
            console.log('Group deleted successfully')
        } catch (error) {
            console.error('Error deleting group:', error)
        }
    }
}
