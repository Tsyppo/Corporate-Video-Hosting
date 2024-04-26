import React from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from '../components/TokenChecker'
import VideoItems from '../components/VideoItems'
import { useNavigate, useParams } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'
import { Playlist as PlaylistType } from '../types/playlist'
import { Video } from '../types/video'

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

const PlaylistDetail: React.FC = () => {
    useAutoLogout()

    const { id } = useParams<{ id?: string }>()
    const playlists = useTypedSelector((state) => state.playlist.playlists)
    const videos = useTypedSelector((state) => state.video.videos)

    if (!playlists) {
        return <div>Playlists not found</div>
    }

    if (!id) {
        return <div>Video ID is not provided</div>
    }

    if (!videos) {
        return <div>Videos not found</div>
    }

    const playlist: PlaylistType | undefined = playlists.find(
        (playlist) => playlist.id === parseInt(id, 10),
    )

    if (!playlist) {
        return <div>Playlist not found</div>
    }
    const playlistId = playlist.id

    return (
        <Layout>
            <TokenChecker
                targetRoute={`/playlist/${playlist.id}`}
            ></TokenChecker>
            <Title>{playlist.title}</Title>
            {/* Передать отфильтрованный список видео в компонент VideoItem */}
            <VideoItems playlistId={playlistId} />
        </Layout>
    )
}

export default PlaylistDetail
