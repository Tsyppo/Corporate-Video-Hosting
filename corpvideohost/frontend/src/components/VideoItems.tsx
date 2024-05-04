import React, { useEffect } from 'react'
import { Video } from '../types/video'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styled from 'styled-components'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Playlist } from '../types/playlist'
import { Group } from '../types/group'
import VideoPlayer from './VideoPlayer'

const VideoContainer = styled.div`
    margin-top: 40px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    /* Выравнивание элементов по горизонтали */
`

const VideoPlace = styled.video`
    height: 225px;
    width: 400px;
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
    cursor: pointer; // Добавляем стили для указания, что элемент является нажимаемым
    &:hover {
        text-decoration: underline; // Добавляем подчеркивание при наведении мыши
    }
    color: ${(props) => props.theme.text};
`

const VideoDescription = styled.p`
    color: ${(props) => props.theme.text};
    margin: 0;
    padding: 10px;
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
    margin-top: 40px;
    cursor: pointer;
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

interface VideoItemProps {
    playlistId?: number
    groupId?: number
}

const VideoItems: React.FC<VideoItemProps> = (props) => {
    const { playlistId, groupId } = props
    const { fetchVideoList, deleteVideo } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)
    const playlists = useTypedSelector((state) => state.playlist.playlists)
    const groups = useTypedSelector((state) => state.group.groups)
    const user = localStorage.getItem('user')
    let userObjectFromStorage: any | null = null
    const location = useLocation()

    if (user !== null) {
        userObjectFromStorage = JSON.parse(user)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    useEffect(() => {
        if (userObjectFromStorage && userObjectFromStorage.id) {
            fetchVideoList()
        } else {
            console.error('User ID is null')
        }
    }, [])

    const handleDelete = (videoId: number) => {
        deleteVideo(videoId)
    }

    if (!videos) {
        return <div>Videos not found</div>
    }

    // Убедитесь, что массивы videos и playlist.videos не пустые
    let filtredVideos: Video[] = []
    const actualGroupId = groupId
    const actualPlaylistId = playlistId

    if (actualPlaylistId != null || actualGroupId != null) {
        if (!playlists && !groups) {
            return <div>Playlists and Groups not found</div>
        }

        if (actualPlaylistId != null && playlists) {
            const playlist: Playlist | undefined = playlists.find(
                (playlist) => playlist.id === actualPlaylistId,
            )

            if (playlist) {
                filtredVideos = videos.filter((video) =>
                    playlist.videos.some(
                        (playlistVideoId) => playlistVideoId === video.id,
                    ),
                )
            } else {
                console.log('Playlist not found')
            }
        }

        if (actualGroupId != null && groups) {
            const group: Group | undefined = groups.find(
                (group) => group.id === actualGroupId,
            )

            if (group) {
                filtredVideos = videos.filter((video) =>
                    group.videos.some(
                        (groupVideoId) => groupVideoId === video.id,
                    ),
                )
            } else {
                console.log('Group not found')
            }
        }
    } else {
        filtredVideos = videos
    }

    // Функция для получения имени пользователя по его идентификатору
    const getCreatorName = (creatorId: number) => {
        if (userObjectFromStorage && userObjectFromStorage.id === creatorId) {
            return userObjectFromStorage.username
        }
        return 'Неизвестный пользователь'
    }

    return (
        <div>
            {filtredVideos &&
                filtredVideos.map((video: Video) => (
                    <div key={video.id}>
                        <VideoContainer>
                            <VideoPlayer video={video}></VideoPlayer>
                            <VideoInfoContainer>
                                <VideoTitle>
                                    <StyledLink to={`/video/${video.id}`}>
                                        {video.title}
                                    </StyledLink>
                                </VideoTitle>
                                <VideoCreator>
                                    Создатель: {getCreatorName(video.creator)}
                                </VideoCreator>
                                <VideoDescription>
                                    {video.description}
                                </VideoDescription>

                                <div>
                                    {/* Показываем кнопки "Удалить" и "Редактировать" только на странице /video */}
                                    {location.pathname === '/videos' && (
                                        <>
                                            <Button
                                                onClick={() =>
                                                    handleDelete(video.id)
                                                }
                                            >
                                                Удалить видео
                                            </Button>
                                            <Button>Редактировать</Button>
                                        </>
                                    )}
                                </div>
                            </VideoInfoContainer>
                        </VideoContainer>
                    </div>
                ))}
        </div>
    )
}

export default VideoItems
