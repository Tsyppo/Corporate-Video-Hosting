import React, { useRef, useEffect, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-hls-quality-selector'
import 'videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css'
import { Video } from '../types/video'
import { styled } from 'styled-components'

import ffmpeg from 'fluent-ffmpeg' // Импортируем библиотеку ffmpeg
interface VideoPlayerProps {
    video: Video
    controls: boolean
    width: number
    height: number
}

const VideoPlayerComponent: React.FC<VideoPlayerProps> = ({
    video,
    controls,
    width,
    height,
}) => {
    const videoNode = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        // Получаем ссылку на видеоэлемент
        const videoElement = videoNode.current

        if (videoElement) {
            // Обработчик события контекстного меню
            const handleContextMenu = (event: MouseEvent) => {
                event.preventDefault() // Предотвращаем появление контекстного меню
            }

            // Добавляем обработчик события контекстного меню к видеоэлементу
            videoElement.addEventListener('contextmenu', handleContextMenu)

            // Возвращаем функцию очистки для удаления обработчика при размонтировании компонента
            return () => {
                videoElement.removeEventListener(
                    'contextmenu',
                    handleContextMenu,
                )
            }
        }
    }, []) // Пустой массив зависимостей гарантирует, что обработчик установится только один раз при монтировании компонента

    useEffect(() => {
        const videoElement = videoNode.current

        if (videoElement) {
            const handleFullScreenChange = () => {
                if (document.fullscreenElement) {
                    // Если видео развернуто на весь экран
                    videoElement.style.width = '100%'
                    videoElement.style.height = '100%'
                } else {
                    // Если видео вышло из полноэкранного режима
                    videoElement.style.width = `${width}px`
                    videoElement.style.height = `${height}px`
                }
            }

            document.addEventListener(
                'fullscreenchange',
                handleFullScreenChange,
            )

            return () => {
                document.removeEventListener(
                    'fullscreenchange',
                    handleFullScreenChange,
                )
            }
        }
    }, [width, height])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (videoNode.current) {
                const resolutions = [
                    { resolution: '360p', url: `${video.video}/360p.m3u8` },
                    { resolution: '480p', url: `${video.video}/480p.m3u8` },
                    { resolution: '720p', url: `${video.video}/720p.m3u8` },
                    { resolution: '1080p', url: `${video.video}/1080p.m3u8` },
                    {
                        resolution: 'Auto',
                        url: `${video.video}/playlist.m3u8`,
                    },
                ]
                const poster = [
                    { poster: 'poster', url: `${video.video}/1080p_000.ts` },
                ]

                const options = {
                    controls: controls,
                    sources: [
                        {
                            src: resolutions[4].url,
                            type: 'application/x-mpegURL',
                        },
                    ],
                    plugins: {
                        hlsQualitySelector: {
                            displayCurrentQuality: true,
                            default: '1080p',
                            qualitySwitcher: true,
                            dynamicLabel: true,
                            resolutions: resolutions.map((res) => ({
                                label: res.resolution,
                                value: res.resolution,
                                selected: res.resolution === '1080p',
                                token: res.url,
                            })),
                        },
                    },
                }

                const player = videojs(videoNode.current, options)

                // Обработчик события воспроизведения
                player.on('play', () => {
                    console.log('Просмотр начат')
                })

                // Обработчик события паузы
                player.on('pause', () => {
                    console.log('Просмотр приостановлен')
                })

                // Обработчик события завершения воспроизведения
                player.on('ended', () => {
                    console.log('Просмотр завершён')
                })

                // Обработчик события изменения времени воспроизведения
                player.on('timeupdate', () => {
                    console.log('Изменение времени воспроизведения')
                })

                return () => {
                    if (player) {
                        player.dispose()
                    }
                }
            }
        }, 1000) // Задержка в 1 секунду

        return () => clearTimeout(timer)
    }, [])

    return (
        <div>
            <div data-vjs-player>
                <video
                    ref={videoNode}
                    className="video-js"
                    style={{ width: `${width}px`, height: `${height}px` }}
                />
            </div>
        </div>
    )
}

export default VideoPlayerComponent
