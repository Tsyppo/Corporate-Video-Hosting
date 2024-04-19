import React from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from '../components/TokenChecker'
import VideoItem from '../components/VideoItem'
import { useNavigate } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'

const Title = styled.h1`
    color: ${(props) => props.theme.text};
`
const Button = styled.button`
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    margin-left: 800px;
`

const Favorites: React.FC = () => {
    const userString = localStorage.getItem('user')
    const { user } = useTypedSelector((state) => state.user)
    if (user !== null) {
        console.log(user.id == 1)
    } else {
        console.log('нет в сторе')
    }

    const navigate = useNavigate()

    useAutoLogout(30 * 60 * 1000, () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    })

    if (userString !== null) {
        const userObjectFromStorage = JSON.parse(userString)
        console.log(userObjectFromStorage)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    return (
        <Layout>
            <TokenChecker targetRoute="/favorites"></TokenChecker>
            <Title>Избранные видео</Title>
            <VideoItem></VideoItem>
        </Layout>
    )
}

export default Favorites
