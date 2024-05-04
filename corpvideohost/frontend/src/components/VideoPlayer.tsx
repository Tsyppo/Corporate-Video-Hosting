import React, { useRef, useEffect } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-hls-quality-selector'
import 'videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css'
import { Video } from '../types/video'

const VideoPlayerComponent: React.FC<{ video: Video }> = ({ video }) => {
    const videoNode = useRef<HTMLVideoElement>(null)

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

                const options = {
                    controls: true,
                    sources: [
                        {
                            src: resolutions[4].url, // Используем плейлист для переключения разрешений
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
        }, 1000) // Задержка в 1 секунду

        return () => clearTimeout(timer)
    }, [])

    return (
        <div>
            <div data-vjs-player>
                <video ref={videoNode} className="video-js" />
            </div>
        </div>
    )
}

export default VideoPlayerComponent
