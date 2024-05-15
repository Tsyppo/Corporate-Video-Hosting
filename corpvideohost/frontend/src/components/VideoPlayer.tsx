import React, { useRef, useEffect, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-hls-quality-selector'
import 'videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css'
import { Video } from '../types/video'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { useActions } from '../hooks/useAction'
import { useLocation } from 'react-router-dom'

interface VideoPlayerProps {
    video: Video
    controls: boolean
    width: number
    height: number
    detail?: boolean
}

let time = 0

const VideoPlayerComponent: React.FC<VideoPlayerProps> = ({
    video,
    controls,
    width,
    height,
    detail,
}) => {
    const videoNode = useRef<HTMLVideoElement>(null)
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    const users = useTypedSelector((state) => state.user.users)
    const analytics = useTypedSelector((state) => state.analytics.analytics)
    const [analyticsCreated, setAnalyticsCreated] = useState<boolean>(false)
    const [initialized, setInitialized] = useState(false)
    const location = useLocation()

    const { fetchListUser, addAnalytics, fetchAnalytics, updateAnalytics } =
        useActions()

    useEffect(() => {
        fetchAnalytics()
        fetchListUser()
    }, [])

    const isAnalyticsExists = (
        userId: number | null,
        videoId: number,
    ): boolean => {
        const exists = analytics!?.some(
            (entry) => entry.user === userId && entry.video === videoId,
        )
        return exists
    }

    let loggedInUser = null

    if (userId && users) {
        loggedInUser = users.find((user) => user.id === userId)
    }

    useEffect(() => {
        const videoElement = videoNode.current

        if (videoElement) {
            const handleContextMenu = (event: MouseEvent) => {
                event.preventDefault()
            }

            videoElement.addEventListener('contextmenu', handleContextMenu)

            return () => {
                videoElement.removeEventListener(
                    'contextmenu',
                    handleContextMenu,
                )
            }
        }
    }, [])

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

                return () => {
                    if (player) {
                        player.dispose()
                    }
                }
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const analyticsStatus = localStorage.getItem(
            `analytics_${userId}_${video.id}`,
        )
        if (
            !initialized &&
            analytics &&
            detail &&
            analyticsStatus !== 'created'
        ) {
            if (!isAnalyticsExists(userId, video.id)) {
                addAnalytics({
                    user: userId,
                    video: video.id,
                    duration: '0',
                })
                console.log('Просмотр начат')

                localStorage.setItem(
                    `analytics_${userId}_${video.id}`,
                    'created',
                )
            } else {
                console.log('Аналитика для данной пары уже существует')
            }
            setInitialized(true)
        } else {
            localStorage.removeItem(`analytics_${userId}_${video.id}`)
        }
    }, [analytics, detail, initialized, userId, video.id])

    useEffect(() => {
        const videoElement = videoNode.current
        let startTime: number | null = null // Время начала просмотра
        let totalWatchedTime = 0 // Общее время просмотра

        if (detail) {
            if (analytics) {
                const targetAnalytics = analytics!.find(
                    (entry) =>
                        entry.user === userId && entry.video === video.id,
                )
                const duration = targetAnalytics?.duration
                    ? parseFloat(targetAnalytics.duration)
                    : 0

                console.log(duration)

                time = duration

                if (videoElement) {
                    const handlePlay = () => {
                        startTime = videoElement.currentTime
                    }

                    const handlePause = () => {
                        if (startTime !== null) {
                            if (time < videoElement.currentTime)
                                time += videoElement.currentTime - startTime
                            console.log('Общее время просмотра всего:', time)

                            if (targetAnalytics) {
                                updateAnalytics(targetAnalytics.id, {
                                    duration: time,
                                    full_duration:
                                        videoElement!.duration.toString(),
                                })
                            }
                        }
                    }

                    const handleEnded = async () => {
                        if (
                            startTime !== null &&
                            time < videoElement.duration - 3
                        ) {
                            console.log(
                                'Просмотр завершен. Общее время просмотра:',
                                time,
                            )
                        } else {
                            if (targetAnalytics) {
                                await updateAnalytics(targetAnalytics.id, {
                                    status: 'Просмотрено',
                                    duration: videoElement!.duration.toString(),
                                    full_duration:
                                        videoElement!.duration.toString(),
                                })
                            }
                            console.log('Ролик просмотрен полностью')
                        }
                    }

                    const handleTimeUpdate = () => {
                        if (startTime !== null && !videoElement.paused) {
                            if (time < videoElement.currentTime)
                                totalWatchedTime =
                                    videoElement.currentTime - startTime
                            else {
                                startTime = videoElement.currentTime
                            }
                            console.log(
                                'Общее время просмотра:',
                                totalWatchedTime,
                            )
                        }
                    }

                    const handleSeeked = () => {
                        startTime = videoElement.currentTime
                    }
                    const handleBeforeUnload = async () => {
                        if (videoNode.current && analytics) {
                            const targetAnalytics = analytics.find(
                                (entry) =>
                                    entry.user === userId &&
                                    entry.video === video.id,
                            )

                            if (targetAnalytics) {
                                await updateAnalytics(targetAnalytics.id, {
                                    duration: time,
                                    full_duration:
                                        videoElement!.duration.toString(),
                                })
                            }
                        }
                    }

                    videoElement.addEventListener('play', handlePlay)
                    videoElement.addEventListener('pause', handlePause)
                    videoElement.addEventListener('ended', handleEnded)
                    videoElement.addEventListener(
                        'timeupdate',
                        handleTimeUpdate,
                    )
                    videoElement.addEventListener('seeked', handleSeeked)
                    window.addEventListener('beforeunload', handleBeforeUnload)

                    return () => {
                        videoElement.removeEventListener('play', handlePlay)
                        videoElement.removeEventListener('pause', handlePause)
                        videoElement.removeEventListener('ended', handleEnded)
                        videoElement.removeEventListener(
                            'timeupdate',
                            handleTimeUpdate,
                        )
                        videoElement.removeEventListener('seeked', handleSeeked)
                        window.removeEventListener(
                            'beforeunload',
                            handleBeforeUnload,
                        )
                    }
                }
            }
        }
    }, [analytics, detail])

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
