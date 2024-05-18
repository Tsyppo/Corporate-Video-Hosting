import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useActions } from '../hooks/useAction'
import { Video } from '../types/video'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Group } from '../types/group'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { User } from '../types/user'
import { Playlist } from '../types/playlist'

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
    bottom: 39px;
    right: 30px;
`
const ContainerPanel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const PanelContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    max-height: 80%;
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
    width: 100%;
    padding: 20px;
`

const MainTitle = styled.h1`
    color: ${(props) => props.theme.text};
    text-align: center;
`

const FormGroup = styled.div`
    margin-bottom: 20px;
`

const VideoCheckboxContainer = styled.ul`
    max-height: 300px;
    overflow-y: auto;
    list-style-type: none;
    padding: 0;
    margin: 0;
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

const SearchInput = styled.input`
    width: 90%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid ${(props) => props.theme.headerBackground};
    border-radius: 5px;
`

const PanelAddVideoToPlaylist: React.FC<{
    isPanelOpen: boolean
    togglePanelAddVideo: () => void
    playlistId: number
}> = ({ isPanelOpen, togglePanelAddVideo, playlistId }) => {
    const { updatePlaylist } = useActions()
    const videos = useTypedSelector((state) => state.video.videos)
    const [selectedVideos, setSelectedVideos] = useState<Video[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    const users = useTypedSelector((state) => state.user.users)
    const { fetchListUser } = useActions()

    useEffect(() => {
        fetchListUser()
    }, [])

    let loggedInUser: User | null = null

    if (userId && users) {
        const foundUser = users.find((user) => user.id === userId)
        if (foundUser) {
            loggedInUser = foundUser
        }
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

        try {
            const response = await axios.get<Playlist>(
                `http://127.0.0.1:8000/api/playlists/${playlistId}/`,
            )
            const currentPlaylist = response.data

            const updatedVideoIds = Array.from(
                new Set([
                    ...currentPlaylist.videos,
                    ...selectedVideos.map((video) => video.id),
                ]),
            )

            updatePlaylist(playlistId, {
                videos: updatedVideoIds,
            } as Partial<Group>)
        } catch (error) {
            console.error('Error fetching group:', error)
        }
    }

    const filteredVideos = videos!.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (!isPanelOpen) return null

    return ReactDOM.createPortal(
        <>
            <Overlay>
                <OverlayContent onClick={togglePanelAddVideo} />
            </Overlay>
            <PanelContainer>
                <MainTitle>Добавление видео</MainTitle>
                <ContainerPanel>
                    <FormContainer onSubmit={handleSubmit}>
                        <SearchInput
                            type="text"
                            placeholder="Поиск видео..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FormGroup>
                            <VideoCheckboxContainer>
                                {filteredVideos.map((video: Video) => (
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

export default PanelAddVideoToPlaylist
