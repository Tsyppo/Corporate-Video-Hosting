import React, { useEffect, useState } from 'react'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styled from 'styled-components'
import Layout from '../components/Layout'
import TokenChecker from '../components/TokenChecker'
import VideoItem from '../components/VideoItems'
import PanelCreateVideo from '../components/PanelCreateVideo'
import useAutoLogout from '../hooks/useAutoLogout'

const Button = styled.button`
    height: 40px;
    font-size: medium;
    margin-top: 20px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
`
const Title = styled.h1`
    margin: 0;
    padding-top: 40px;
    color: ${(props) => props.theme.text};
`

const VideoList: React.FC = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const { fetchVideoListUser } = useActions()
    useAutoLogout()

    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null

    useEffect(() => {
        fetchVideoListUser(userId!)
    }, [])

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen)
    }

    return (
        <Layout>
            <TokenChecker targetRoute="/videos"></TokenChecker>
            <div>
                <Title>Список видео</Title>
                <>
                    <Button onClick={togglePanel}>Добавить видео</Button>
                    <PanelCreateVideo
                        isPanelOpen={isPanelOpen}
                        togglePanel={togglePanel}
                    />
                </>
                <VideoItem></VideoItem>
            </div>
        </Layout>
    )
}

export default VideoList
