import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { loginUserSuccess, logoutUser } from '../store/actions/userActions'
import axios from 'axios'

const TokenChecker: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useTypedSelector((state) => state.user)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            // Отправляем POST запрос на сервер для проверки валидности токена
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
                        // Если токен действителен, загружаем данные пользователя
                        loginUserSuccess(token)
                        navigate('/main') // Редирект на главную страницу
                    } else {
                        // Если токен недействителен, очищаем состояние пользователя и перенаправляем на страницу входа
                        logoutUser()
                        navigate('/login') // Редирект на страницу входа
                    }
                })
                .catch((error) => {
                    console.error('Error checking token:', error)
                    // Обработка ошибки, например, перенаправление на страницу ошибки
                })
        } else {
            // Если токен отсутствует, перенаправляем на страницу входа
            navigate('/login')
        }
    }, []) // Нет зависимостей, так как useEffect должен выполниться только один раз

    return null // Компонент ничего не отображает, только выполняет логику
}

export default TokenChecker
