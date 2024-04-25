import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/reducers'
import { fetchGroupList } from '../store/actions/groupActions'
import { Group } from '../types/group'
import { useTypedSelector } from '../hooks/useTypedSelector'

const GroupList: React.FC = () => {
    const dispatch = useDispatch()
    const { groups } = useTypedSelector((state) => state.group)

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchGroupList()(dispatch)
            } catch (error) {
                console.error('Error fetching group list:', error)
            }
        }

        fetchData()
    }, [dispatch])

    return (
        <div>
            <h2>Group List</h2>
            {groups ? (
                <ul>
                    {groups.map((group: Group) => (
                        <li key={group.id}>
                            <h3>{group.title}</h3>
                            <p>{group.description}</p>
                            {/* Другие поля группы, которые вы хотите отобразить */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default GroupList
