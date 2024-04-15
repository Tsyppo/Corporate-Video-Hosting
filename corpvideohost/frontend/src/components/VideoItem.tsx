import React, { useEffect } from 'react'
import { Video } from '../types/video'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styled from 'styled-components'
import { Link, useNavigate, useLocation } from 'react-router-dom'

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

const VideoItem: React.FC = () => {
    const { fetchVideoList, deleteVideo } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)
    const user = localStorage.getItem('user')
    let userObjectFromStorage: any | null = null
    const navigate = useNavigate()
    const location = useLocation()

    if (user !== null) {
        userObjectFromStorage = JSON.parse(user)
        console.log(userObjectFromStorage)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    useEffect(() => {
        fetchVideoList(userObjectFromStorage.id)
    }, [])

    const handleDelete = (videoId: number) => {
        deleteVideo(videoId)
    }
    const handleVideoClick = (videoId: number) => {
        navigate(`/video/${videoId}`) // Переход на страницу с конкретным видео
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
            {videos &&
                videos.map((video: Video) => (
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
