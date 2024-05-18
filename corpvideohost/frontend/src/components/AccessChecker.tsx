import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../types/user'
import { Group } from '../types/group'

interface AccessCheckerProps {
    user: User | null
    group: Group
    userId: number | null
    setRedirectedByAccessChecker: (value: boolean) => void
}

const AccessChecker: React.FC<AccessCheckerProps> = ({
    user,
    group,
    userId,
    setRedirectedByAccessChecker,
}) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (
            !user ||
            (!group.members.includes(userId!) && group.creator !== userId)
        ) {
            setRedirectedByAccessChecker(true)
            navigate('/groups')
        }
    }, [user, group, userId, navigate, setRedirectedByAccessChecker])

    return null // Ничего не отображает
}

export default AccessChecker
