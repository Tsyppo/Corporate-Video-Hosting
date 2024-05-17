import React, { useEffect } from 'react'
import { useTypedSelector } from '../hooks/useTypedSelector'
import VideoPlayer from './VideoPlayer'
import { Video } from '../types/video'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { useActions } from '../hooks/useAction'
import { styled } from 'styled-components'
import useAutoLogout from '../hooks/useAutoLogout'
import { Link } from 'react-router-dom'

const Container = styled.div`
    margin-top: 20px;
    color: ${(props) => props.theme.text};
`
const CarouselSlider = styled(Carousel)`
    height: 400px;
    width: 1000px;
    margin: 0 auto;
    padding-left: 200px;
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

const VideoSlider: React.FC = () => {
    useAutoLogout()
    const videos = useTypedSelector((state) => state.video.videos)

    const { fetchVideoList } = useActions()

    useEffect(() => {
        fetchVideoList()
    }, [])

    if (!videos) {
        return <div>Videos not found</div>
    }
    const publicVideos = videos.filter(
        (video: Video) => video.status === 'public',
    )
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            partialVisibilityGutter: 350,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    }
    const scaleFactor = 0.6
    return (
        <Container className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            <CarouselSlider
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                keyBoardControl={true}
                customTransition="transform 500ms ease-in-out"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={['tablet', 'mobile']}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                partialVisible={true}
                focusOnSelect={false}
                rewindWithAnimation={true}
            >
                {publicVideos.map((video: Video) => (
                    <div
                        key={video.id}
                        className="flex justify-center items-center h-full"
                    >
                        <StyledLink to={`/video/${video.id}`}>
                            <VideoPlayer
                                video={video}
                                controls={false}
                                detail={false}
                                width={1280 * scaleFactor}
                                height={720 * scaleFactor}
                            />
                        </StyledLink>
                    </div>
                ))}
            </CarouselSlider>
        </Container>
    )
}

export default VideoSlider
