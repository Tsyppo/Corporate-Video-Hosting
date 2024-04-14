import React, { useEffect } from 'react'
import { Video } from '../types/video'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styled from 'styled-components'

const VideoPlace = styled.video`
    height: 225px;
    width: 400px;
`

const VideoPlayer: React.FC = () => {
    const { fetchVideoList, deleteVideo } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)
    const user = localStorage.getItem('user')
    let userObjectFromStorage: any | null = null

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

    return (
        <div>
            <h1>Список видео</h1>
            {videos &&
                videos.map((video: Video) => (
                    <div key={video.id}>
                        <h2>{video.title}</h2>
                        <p>{video.description}</p>
                        <VideoPlace controls>
                            <source src={video.video} type="video/mp4" />
                            Ваш браузер не поддерживает видео.
                        </VideoPlace>
                        <button onClick={() => handleDelete(video.id)}>
                            Удалить видео
                        </button>
                    </div>
                ))}
        </div>
    )
}

export default VideoPlayer
