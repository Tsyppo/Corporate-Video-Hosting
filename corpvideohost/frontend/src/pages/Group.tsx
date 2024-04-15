import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import styled from 'styled-components'
import ReactDOM from 'react-dom'
import VideoItem from '../components/VideoItem'
import Playlist from '../components/Playlists'

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

const VipButton = styled(Button)`
    margin-right: 30px;
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
    margin-top: 50px;
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
`
const SecondTitle = styled.h3`
    color: ${(props) => props.theme.text};
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

const Texrarea = styled.textarea`
    width: 100%;
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
const Group: React.FC = () => {
    const userString = localStorage.getItem('user')

    if (userString !== null) {
        const userObjectFromStorage = JSON.parse(userString)
        console.log(userObjectFromStorage)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }
    let userObjectFromStorage

    if (userString !== null) {
        userObjectFromStorage = JSON.parse(userString)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    let role = userObjectFromStorage?.role
    const [isPanelOpen, setIsPanelOpen] = useState(false)

    const togglePanelPlaylist = () => {
        setIsPanelOpen(!isPanelOpen)
    }

    const togglePanelAddVideo = () => {
        setIsPanelOpen(!isPanelOpen)
    }
    const { id } = useParams<{ id?: string }>()

    const groups = [
        { id: 1, name: 'Группа 1', participants: 10, avatar: 'avatar1.png' },
        { id: 2, name: 'Группа 2', participants: 15, avatar: 'avatar2.png' },
        { id: 3, name: 'Группа 3', participants: 20, avatar: 'avatar3.png' },
        { id: 4, name: 'Группа 4', participants: 20, avatar: 'avatar3.png' },
        { id: 5, name: 'Группа 5', participants: 35, avatar: 'avatar3.png' },
        { id: 6, name: 'Группа 6', participants: 20, avatar: 'avatar3.png' },
        { id: 7, name: 'Группа 7', participants: 30, avatar: 'avatar3.png' },
        { id: 8, name: 'Группа 8', participants: 20, avatar: 'avatar3.png' },
        { id: 9, name: 'Группа 9', participants: 20, avatar: 'avatar3.png' },
        { id: 10, name: 'Группа 10', participants: 40, avatar: 'avatar3.png' },
        { id: 11, name: 'Группа 11', participants: 20, avatar: 'avatar3.png' },
        { id: 12, name: 'Группа 12', participants: 20, avatar: 'avatar3.png' },
    ]

    if (!groups) {
        return <div>Loading...</div>
    }

    if (!id) {
        return <div>Video ID is not provided</div>
    }

    const group = groups.find((group) => group.id === parseInt(id, 10))

    if (!group) {
        return <div>Группа не найдена</div>
    }

    return (
        <Layout>
            <MainTitle>{group.name}</MainTitle>
            <>
                {role === 'manager' || role === 'admin' ? (
                    <VipButton>Добавить видео</VipButton>
                ) : null}
                {role === 'manager' || role === 'admin' ? (
                    <VipButton>Добавить пользователя</VipButton>
                ) : null}
                {role === 'manager' || role === 'admin' ? (
                    <VipButton>Просмотр заявок</VipButton>
                ) : null}
                {role === 'manager' || role === 'admin' ? (
                    <VipButton onClick={togglePanelPlaylist}>
                        Создать плейлист
                    </VipButton>
                ) : null}
                {isPanelOpen &&
                    ReactDOM.createPortal(
                        <>
                            <Overlay>
                                <OverlayContent onClick={togglePanelPlaylist} />{' '}
                            </Overlay>
                            <PanelContainer>
                                <MainTitle>Создание плейлиста</MainTitle>
                                <ContainerPanel>
                                    <FormContainer>
                                        <FormGroup>
                                            <Input
                                                type="text"
                                                placeholder="Title"
                                                id="title"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Texrarea
                                                placeholder="Description"
                                                id="description"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label htmlFor="status">
                                                Статус:
                                            </Label>
                                            <StyledSelect
                                                id="status"
                                                value={status}
                                            >
                                                <Option value="public">
                                                    Public
                                                </Option>
                                                <Option value="private">
                                                    Private
                                                </Option>
                                                <Option value="unlisted">
                                                    Unlisted
                                                </Option>
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
                    )}
            </>
            <Playlist
                playlists={[
                    { name: 'Плейлист 1', description: 'Описание плейлиста 1' },
                    { name: 'Плейлист 2', description: 'Описание плейлиста 2' },
                    { name: 'Плейлист 3', description: 'Описание плейлиста 3' },
                ]}
            />
            <SecondTitle>Видео:</SecondTitle>
            <VideoItem></VideoItem>
        </Layout>
    )
}

export default Group
