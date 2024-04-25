import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Video as VideoType } from '../types/video'
import Layout from '../components/Layout'
import styled from 'styled-components'
import TokenChecker from '../components/TokenChecker'
import useAutoLogout from '../hooks/useAutoLogout'

const Container = styled.div`
    margin-left: 150px;
`

const VideoTitle = styled.h1`
    margin: 0;
    color: ${(props) => props.theme.text};
`

const VideoPlace = styled.video`
    height: 715px;
    padding-top: 30px;
`

const Texrarea = styled.textarea`
    width: 600px;
    height: 100px;
    padding: 10px;
    color: ${(props) => props.theme.text};
    font-size: 18px;
    border: 1px solid #a5a4a4;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.1);
    resize: none;
    overflow: auto;
    &::placeholder {
        color: #ccc;
        font-size: 16px;
    }
`

const Text = styled.h4`
    color: ${(props) => props.theme.text};
`

const Button = styled.button`
    height: 40px;
    font-size: medium;
    margin-left: 10px; /* Добавляем отступ слева */
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`
const ButtonAddFav = styled.button`
    height: 40px;
    font-size: medium;
    margin-left: 20px; /* Добавляем отступ слева */
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`

const ButtonAnaliz = styled(ButtonAddFav)`
    margin-left: 710px;
`

const FlexContainer = styled.div`
    display: flex; /* Размещаем элементы в строку */
    margin-top: 20px;
`

const ContainerVideo = styled.div`
    display: flex; /* Размещаем элементы в строку */
    margin-top: 20px;
    align-items: center;
`

const Video: React.FC = () => {
    useAutoLogout()

    const { id } = useParams<{ id?: string }>()
    const videos = useTypedSelector((state) => state.video.videos)
    console.log(videos)

    if (!videos) {
        return <div>Loading...</div>
    }

    if (!id) {
        return <div>Video ID is not provided</div>
    }

    const video: VideoType | undefined = videos.find(
        (video) => video.id === parseInt(id, 10),
    )

    if (!video) {
        return <div>Video not found</div>
    }

    return (
        <Layout>
            <TokenChecker targetRoute={`/video/${video.id}`}></TokenChecker>
            <Container>
                <VideoPlace controls>
                    <source src={video.video} type="video/mp4" />
                    Your browser does not support the video.
                </VideoPlace>
                <ContainerVideo>
                    <VideoTitle>{video.title}</VideoTitle>
                    <ButtonAnaliz>Аналитика</ButtonAnaliz>
                    <ButtonAddFav>Добавить в избранное</ButtonAddFav>
                </ContainerVideo>
                <Text>{video.description}</Text>
                <VideoTitle>Комментарии</VideoTitle>
                <FlexContainer>
                    <Texrarea placeholder="Комментарии" />
                    <Button>Отправить комментарий</Button>
                </FlexContainer>
            </Container>
        </Layout>
    )
}

export default Video
