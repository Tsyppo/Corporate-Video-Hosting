import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useActions } from '../hooks/useAction'
import { Video } from '../types/video'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Group } from '../types/group'

const Button = styled.button`
    height: 40px;
    font-size: medium;
    margin-left: auto;
    margin-right: 450px;
    margin-top: 20px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`

const ButtonPanel = styled.button`
    height: 40px;
    font-size: medium;
    margin-top: 20px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`

const ButtonClosePanel = styled(ButtonPanel)`
    margin-top: 280px;
    margin-left: 70%;
`

const ContainerPanel = styled.div`
    display: flex;
`

const PanelContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    padding: 20px;
    border-radius: 10px;

    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(40px);
    z-index: 10000;
`

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    pointer-events: none;
`

const OverlayContent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
`

const FormContainer = styled.form`
    width: 520px;
    padding: 20px;
`

const MainTitle = styled.h1`
    color: ${(props) => props.theme.text};
    margin-left: 140px;
    text-align: center;
`

const FormGroup = styled.div`
    margin-bottom: 20px;
`

const VideoCheckboxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
`

const VideoCheckboxLabel = styled.label`
    display: block;
    margin-right: 20px;
    margin-bottom: 10px;
    font-size: 16px;
    color: ${(props) => props.theme.text};
`

const PanelAddVideo: React.FC<{
    isPanelOpen: boolean
    togglePanelAddVideo: () => void
    groupId: number
}> = ({ isPanelOpen, togglePanelAddVideo, groupId }) => {
    const { fetchVideoListUser, updateGroup } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)
    const [selectedVideos, setSelectedVideos] = useState<Video[]>([])

    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null

    useEffect(() => {
        fetchVideoListUser(userId!)
    }, [])

    const handleCheckboxChange = (video: Video) => {
        setSelectedVideos((prevSelectedVideos) =>
            prevSelectedVideos.includes(video)
                ? prevSelectedVideos.filter((v) => v !== video)
                : [...prevSelectedVideos, video],
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const selectedVideoIds = selectedVideos.map((video) => video.id)

        updateGroup(groupId, { videos: selectedVideoIds } as Partial<Group>)
    }

    if (!isPanelOpen) return null

    return ReactDOM.createPortal(
        <>
            <Overlay>
                <OverlayContent onClick={togglePanelAddVideo} />{' '}
            </Overlay>
            <PanelContainer>
                <MainTitle>Добавление видео</MainTitle>
                <ContainerPanel>
                    <FormContainer onSubmit={handleSubmit}>
                        <FormGroup>
                            <VideoCheckboxContainer>
                                {videos &&
                                    videos.map((video: Video) => (
                                        <VideoCheckboxLabel key={video.id}>
                                            <input
                                                type="checkbox"
                                                checked={selectedVideos.includes(
                                                    video,
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(video)
                                                }
                                            />
                                            {video.title}
                                        </VideoCheckboxLabel>
                                    ))}
                            </VideoCheckboxContainer>
                        </FormGroup>
                        <Button type="submit">Добавить</Button>
                    </FormContainer>
                </ContainerPanel>
                <ButtonClosePanel onClick={togglePanelAddVideo}>
                    Закрыть панель
                </ButtonClosePanel>
            </PanelContainer>
        </>,
        document.body,
    )
}

export default PanelAddVideo
