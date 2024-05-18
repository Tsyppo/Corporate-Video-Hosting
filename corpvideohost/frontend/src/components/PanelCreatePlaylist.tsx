import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useActions } from '../hooks/useAction'
import { Video } from '../types/video'
import { useTypedSelector } from '../hooks/useTypedSelector'

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
    position: absolute;
    bottom: 30px;
    right: 30px;
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
    text-align: center;
`

const FormGroup = styled.div`
    margin-bottom: 20px;
`

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-size: 20px;
    color: ${(props) => props.theme.text};
`

const Input = styled.input`
    color: ${(props) => props.theme.text};
    font-size: medium;
    width: 100%;
    padding: 10px;
    border: 1px solid #a5a4a4;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.1);
    &::placeholder {
        color: #ccc;
        font-size: 16px;
    }
`

const StyledSelect = styled.select`
    appearance: none;
    width: 100%;
    padding: 10px;
    border: 1px solid #a5a4a4;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.1);
    font-size: 16px;
    color: ${(props) => props.theme.text};
    cursor: pointer;
    option {
        background-color: rgba(0, 0, 0, 0.1);
    }
`

const Option = styled.option`
    background-color: rgba(0, 0, 0, 0.1);
    font-size: 16px;
    color: black;
    cursor: pointer;
`

const VideoCheckboxContainer = styled.ul`
    max-height: 500px;
    overflow-y: auto;
    list-style-type: none;
    padding: 0;
    margin: 0;
    margin-top: 15px;
`

const VideoCheckboxItem = styled.li`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`

const VideoCheckboxLabel = styled.label`
    font-size: 16px;
    color: ${(props) => props.theme.text};
    margin-left: 8px;
`

const VideoCheckboxInput = styled.input`
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${(props) => props.theme.headerBackground};
`

const PanelCreatePlaylist: React.FC<{
    isPanelOpen: boolean
    togglePanelPlaylist: () => void
    groupId: number
}> = ({ isPanelOpen, togglePanelPlaylist, groupId }) => {
    const { fetchVideoListUser, uploadPlaylist } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)
    const [title, setTitle] = useState('')
    const [status, setStatus] = useState('unlisted')
    const [selectedVideos, setSelectedVideos] = useState<Video[]>([])

    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null

    useEffect(() => {
        fetchVideoListUser(userId!)
    }, [])

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value)
    }

    const handleCheckboxChange = (video: Video) => {
        setSelectedVideos((prevSelectedVideos) =>
            prevSelectedVideos.includes(video)
                ? prevSelectedVideos.filter((v) => v !== video)
                : [...prevSelectedVideos, video],
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!title || !status) {
            console.error('Please fill in all fields')
            return
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('status', status)
        formData.append('group', groupId.toString())

        selectedVideos.forEach((video) => {
            formData.append('videos', video.id.toString())
        })

        uploadPlaylist(formData)
    }

    if (!isPanelOpen) return null

    return ReactDOM.createPortal(
        <>
            <Overlay>
                <OverlayContent onClick={togglePanelPlaylist} />{' '}
            </Overlay>
            <PanelContainer>
                <MainTitle>Создание плейлиста</MainTitle>
                <ContainerPanel>
                    <FormContainer onSubmit={handleSubmit}>
                        <FormGroup>
                            <Input
                                type="text"
                                placeholder="Title"
                                id="title"
                                value={title}
                                onChange={handleTitleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Список загруженных видео:</Label>
                            <VideoCheckboxContainer>
                                {videos &&
                                    videos.map((video: Video) => (
                                        <VideoCheckboxItem key={video.id}>
                                            <VideoCheckboxInput
                                                type="checkbox"
                                                checked={selectedVideos.includes(
                                                    video,
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(video)
                                                }
                                            />
                                            <VideoCheckboxLabel>
                                                {video.title}
                                            </VideoCheckboxLabel>
                                        </VideoCheckboxItem>
                                    ))}
                            </VideoCheckboxContainer>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="status">Статус:</Label>
                            <StyledSelect
                                id="status"
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <Option value="public">Public</Option>
                                <Option value="private">Private</Option>
                                <Option value="unlisted">Unlisted</Option>
                            </StyledSelect>
                        </FormGroup>
                        <Button type="submit">Создать</Button>
                    </FormContainer>
                </ContainerPanel>
                <ButtonClosePanel onClick={togglePanelPlaylist}>
                    Закрыть панель
                </ButtonClosePanel>
            </PanelContainer>
        </>,
        document.body,
    )
}

export default PanelCreatePlaylist
