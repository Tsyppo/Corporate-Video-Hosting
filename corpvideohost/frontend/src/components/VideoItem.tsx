import React, { useEffect } from 'react'
import { Video } from '../types/video'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styled from 'styled-components'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Playlist } from '../types/playlist'

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
}

const VideoItem: React.FC<VideoItemProps> = (playlistId) => {
    const { fetchVideoList, deleteVideo } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)

    const user = localStorage.getItem('user')
    let userObjectFromStorage: any | null = null
    const location = useLocation()

    if (user !== null) {
        userObjectFromStorage = JSON.parse(user)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    try {
        useEffect(() => {
            fetchVideoList(userObjectFromStorage.id)
        }, [])
    } catch {
        console.log('error')
    }

    const handleDelete = (videoId: number) => {
        deleteVideo(videoId)
    }

    if (!videos) {
        return <div>Videos not found</div>
    }

    // Убедитесь, что массивы videos и playlist.videos не пустые
    let playlistVideos: Video[] = []
    const actualPlaylistId = playlistId.playlistId

    if (actualPlaylistId != null) {
        const playlists = useTypedSelector((state) => state.playlist.playlists)

        if (!playlists) {
            return <div>Playlists not found</div>
        }

        // Находим плейлист по переданному playlistId
        const playlist: Playlist | undefined = playlists.find(
            (playlist) => playlist.id === actualPlaylistId,
        )

        // Если плейлист найден и у него есть видео, фильтруем видео по их id
        if (playlist) {
            playlistVideos = videos.filter((video) =>
                playlist.videos.some(
                    (playlistVideoId) => playlistVideoId === video.id,
                ),
            )
        } else {
            // Если плейлист не найден или у него нет видео, отображаем все видео
            playlistVideos = videos
        }
    } else {
        playlistVideos = videos
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
            {playlistVideos &&
                playlistVideos.map((video: Video) => (
                    <div key={video.id}>
                        <VideoContainer>
                            <VideoPlace>
                                <source src={video.video} type="video/mp4" />
                                Ваш браузер не поддерживает видео.
                            </VideoPlace>
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

export default VideoItem
