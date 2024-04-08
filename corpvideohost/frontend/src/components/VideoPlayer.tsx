import React, { useEffect } from 'react'
import { Video } from '../types/video'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'

const VideoPlayer: React.FC = () => {
    const { fetchVideoList, deleteVideo } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)

    useEffect(() => {
        fetchVideoList() // Загрузить список видео при монтировании компонента
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
                        <video controls>
                            <source src={video.video} type="video/mp4" />
                            Ваш браузер не поддерживает видео.
                        </video>
                        <button onClick={() => handleDelete(video.id)}>
                            Удалить видео
                        </button>
                    </div>
                ))}
        </div>
    )
}

export default VideoPlayer
