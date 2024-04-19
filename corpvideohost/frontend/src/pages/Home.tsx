import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from '../components/TokenChecker'
import { useNavigate } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'

const Title = styled.h1`
    color: ${(props) => props.theme.text};
    margin-top: 300px;
    margin-left: 300px;
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
    margin-left: 700px;
`

const Home: React.FC = () => {
    const navigate = useNavigate()

    useAutoLogout(30 * 60 * 1000, () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    })

    const userString = localStorage.getItem('user')
    const { user } = useTypedSelector((state) => state.user)
    if (user !== null) {
        console.log(user.id == 1)
    } else {
        console.log('нет в сторе')
    }

    if (userString !== null) {
        const userObjectFromStorage = JSON.parse(userString)
        console.log(userObjectFromStorage)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    const handleButtonClick = () => {
        navigate('/groups')
    }

    return (
        <Layout>
            <TokenChecker targetRoute="/main"></TokenChecker>
            <Title>
                Здесь будут отображаться группы в которых вы состоите!
            </Title>
            <Button onClick={handleButtonClick}>Перейти к списку групп</Button>
        </Layout>
    )
}

export default Home
