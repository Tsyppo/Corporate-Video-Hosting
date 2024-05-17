import React, { useEffect } from 'react'
import { Video } from '../types/video'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import Layout from '../components/Layout'
import TokenChecker from '../components/TokenChecker'
import useAutoLogout from '../hooks/useAutoLogout'

const MainTitle = styled.h1`
    font-size: 32px;
    color: ${(props) => props.theme.text};
`

const Container = styled.div`
    margin-top: 30px;
    display: flex;
    align-items: center;
`

const VideoContainer = styled.div`
    margin-top: 40px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
`

const VideoInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
`

const VideoTitle = styled.h2`
    margin: 0;
    padding: 10px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
    color: ${(props) => props.theme.text};
`

const VideoCreator = styled.p`
    color: ${(props) => props.theme.text};
    margin: 0;
    padding: 10px;
`

const Button = styled.button`
    height: 40px;
    font-size: medium;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
    margin-left: 30px;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
`

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;

    &:hover {
        color: inherit;
    }

    &:active {
        color: inherit;
    }
`

const Title = styled.h1`
    color: ${(props) => props.theme.text};
    margin-top: 150px;
    margin-left: 300px;
`

const History: React.FC = () => {
    const { fetchVideoList } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)
    const users = useTypedSelector((state) => state.user.users)

    useAutoLogout()

    useEffect(() => {
        fetchVideoList()
    }, [])

    if (!videos) {
        return (
            <Layout>
                <div>Videos not found</div>
            </Layout>
        )
    }

    const viewedVideoIdsString = localStorage.getItem('viewedVideoIds')

    const viewedVideoIds: string[] = viewedVideoIdsString
        ? JSON.parse(viewedVideoIdsString)
        : []

    const filteredVideos = videos.filter((video) =>
        viewedVideoIds.includes(video.id.toString()),
    )
    const sortedFilteredVideos = filteredVideos.sort((a, b) => {
        const indexA = viewedVideoIds.indexOf(a.id.toString())
        const indexB = viewedVideoIds.indexOf(b.id.toString())
        return indexA - indexB
    })

    const reversedSortedFilteredVideos = sortedFilteredVideos.slice().reverse()

    const getCreatorName = (creatorId: number) => {
        const creator = users?.find((user) => user.id === creatorId)
        return creator ? creator.username : 'Неизвестный пользователь'
    }

    const handleClearHistory = () => {
        localStorage.removeItem('viewedVideoIds')
        window.location.reload()
    }

    const scaleFactor = 0.7

    return (
        <Layout>
            <TokenChecker targetRoute="/history"></TokenChecker>
            {reversedSortedFilteredVideos.length === 0 ? (
                <MainTitle>История просмотров пуста</MainTitle>
            ) : (
                <Container>
                    <MainTitle>История просмотров</MainTitle>
                    <Button onClick={handleClearHistory}>
                        Очистить историю
                    </Button>
                </Container>
            )}
            <div>
                {reversedSortedFilteredVideos.map((video: Video) => (
                    <div key={video.id}>
                        <VideoContainer>
                            <VideoPlayer
                                video={video}
                                controls={false}
                                width={640 * scaleFactor}
                                height={360 * scaleFactor}
                            ></VideoPlayer>
                            <VideoInfoContainer>
                                <VideoTitle>
                                    <StyledLink to={`/video/${video.id}`}>
                                        {video.title}
                                    </StyledLink>
                                </VideoTitle>
                                <VideoCreator>
                                    Создатель: {getCreatorName(video.creator)}
                                </VideoCreator>
                            </VideoInfoContainer>
                        </VideoContainer>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export default History
