import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import useAutoLogout from '../hooks/useAutoLogout'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'

const Button = styled.button`
    height: 40px;
    font-size: medium;

    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`
const Title = styled.h1`
    margin: 0;
    padding-top: 40px;
    color: ${(props) => props.theme.text};
`

const ButtonClosePanel = styled(Button)`
    margin-top: 10px;
    margin-left: 70%;
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

const Container = styled.div`
    display: flex;
`

const FormContainer = styled.form`
    width: 520px;
    padding: 20px;
`

const MainTitle = styled.h1`
    text-align: center;
    color: white;
`

const Text = styled.h4`
    margin-left: 10px;
    color: white;
`

const PlaceTextButton = styled.div`
    display: flex;
    align-items: center;
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

const PanelUpdateVideo: React.FC<{
    isPanelOpen: boolean
    togglePanel: () => void
    videoId: number
}> = ({ isPanelOpen, togglePanel, videoId }) => {
    useAutoLogout()

    const { fetchVideoListUser } = useActions()
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null

    useEffect(() => {
        fetchVideoListUser(userId!)
    }, [])

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('unlisted')
    const [video, setVideo] = useState<File | null>(null)
    const { updateVideo } = useActions()

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setDescription(e.target.value)
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('status', status)
        console.log(videoId)

        updateVideo(videoId, formData)
    }

    if (!isPanelOpen) return null

    return ReactDOM.createPortal(
        <>
            <Overlay>
                <OverlayContent onClick={togglePanel} />{' '}
            </Overlay>
            <PanelContainer>
                <MainTitle>Редактирование видео</MainTitle>
                <Container>
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
                            <Texrarea
                                placeholder="Description"
                                id="description"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
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
                        <Button type="submit">Обновить</Button>
                    </FormContainer>
                </Container>
                <ButtonClosePanel onClick={togglePanel}>
                    Закрыть панель
                </ButtonClosePanel>
            </PanelContainer>
        </>,
        document.body,
    )
}

export default PanelUpdateVideo
