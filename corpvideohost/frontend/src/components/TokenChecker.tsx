import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUserSuccess, logoutUser } from '../store/actions/userActions'
import axios from 'axios'

const TokenChecker: React.FC<{ targetRoute: string }> = ({ targetRoute }) => {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            axios
                .post(
                    'http://127.0.0.1:8000/api/check_token/',
                    { token },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                .then((response) => {
                    const { valid } = response.data
                    if (valid) {
                        loginUserSuccess(token)
                        navigate(targetRoute) // Переход на указанный маршрут
                    } else {
                        logoutUser()
                        navigate('/login')
                    }
                })
                .catch((error) => {
                    console.error('Error checking token:', error)
                })
        } else {
            navigate('/login')
        }
    }, [])

    return null
}

export default TokenChecker
