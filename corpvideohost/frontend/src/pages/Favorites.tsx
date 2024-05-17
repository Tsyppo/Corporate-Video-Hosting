import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from '../components/TokenChecker'
import VideoItems from '../components/VideoItems'
import { useNavigate } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'
import { useActions } from '../hooks/useAction'

const Title = styled.h1`
    font-size: 32px;
    margin-top: 20px;
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
    useAutoLogout()
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    const users = useTypedSelector((state) => state.user.users)
    const { fetchListUser, fetchVideoList } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)

    useEffect(() => {
        fetchVideoList()
        fetchListUser()
    }, [])

    let loggedInUser = null

    if (userId && users) {
        loggedInUser = users.find((user) => user.id === userId)
    }

    return (
        <Layout>
            <TokenChecker targetRoute="/favorites"></TokenChecker>
            <Title>Избранные видео</Title>
            <VideoItems isfavorite={true}></VideoItems>
        </Layout>
    )
}

export default Favorites
