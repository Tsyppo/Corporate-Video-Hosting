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
