import React, { Suspense, useState } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from '../components/TokenChecker'
import VideoItems from '../components/VideoItems'
import { useNavigate, useParams } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'
import { Playlist as PlaylistType } from '../types/playlist'
import { Video } from '../types/video'
import { User } from '../types/user'

const LazyPanelAddVideo = React.lazy(
    () => import('../components/PanelAddVideoToPlaylist'),
)

const Title = styled.h1`
    color: ${(props) => props.theme.text};
`
const Button = styled.button`
    height: 40px;
    font-size: medium;
    margin-left: auto;
    margin-right: 450px;
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
const VipButton = styled(Button)`
    margin-right: 30px;
`

const PlaylistDetail: React.FC = () => {
    useAutoLogout()
    const { id } = useParams<{ id?: string }>()
    const playlists = useTypedSelector((state) => state.playlist.playlists)
    const videos = useTypedSelector((state) => state.video.videos)
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    const users = useTypedSelector((state) => state.user.users)
    const [isPanelAddVideoOpen, setIsPanelAddVideoOpen] = useState(false)
    let loggedInUser: User | null = null

    if (userId && users) {
        const foundUser = users.find((user) => user.id === userId)
        if (foundUser) {
            loggedInUser = foundUser
        }
    }

    let role = loggedInUser?.role

    const playlist: PlaylistType | undefined = playlists!.find(
        (playlist) => playlist.id === parseInt(id!, 10),
    )

    if (!playlist) {
        return <div>Playlist not found</div>
    }

    const togglePanelAddVideo = () => {
        setIsPanelAddVideoOpen(!isPanelAddVideoOpen)
    }
    return (
        <Layout>
            <TokenChecker
                targetRoute={`/playlist/${playlist.id}`}
            ></TokenChecker>
            <Title>{playlist.title}</Title>
            <>
                {role === 'manager' || role === 'admin' ? (
                    <VipButton onClick={togglePanelAddVideo}>
                        Добавить видео
                    </VipButton>
                ) : null}
                <Suspense fallback={<div>Loading...</div>}>
                    {isPanelAddVideoOpen && (
                        <LazyPanelAddVideo
                            isPanelOpen={isPanelAddVideoOpen}
                            togglePanelAddVideo={togglePanelAddVideo}
                            playlistId={playlist.id}
                        />
                    )}
                </Suspense>
            </>
            {/* Передать отфильтрованный список видео в компонент VideoItem */}
            <VideoItems playlistId={playlist.id} />
        </Layout>
    )
}

export default PlaylistDetail
