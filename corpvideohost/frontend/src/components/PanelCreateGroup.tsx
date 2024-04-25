import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useActions } from '../hooks/useAction'

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

const PanelCreateGroup: React.FC<{
    isPanelOpen: boolean
    togglePanel: () => void
}> = ({ isPanelOpen, togglePanel }) => {
    const user = localStorage.getItem('user')
    let userObjectFromStorage: any | null = null

    if (user !== null) {
        userObjectFromStorage = JSON.parse(user)
        console.log(userObjectFromStorage)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('unlisted')
    const { uploadGroup } = useActions()

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

        if (!title || !description || !status) {
            console.error('Please fill in all fields')
            return
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('status', status)
        if (user) {
            formData.append('creator', userObjectFromStorage.id)
        }

        uploadGroup(formData)
    }
    if (!isPanelOpen) return null

    return ReactDOM.createPortal(
        <>
            <Overlay>
                <OverlayContent onClick={togglePanel} />{' '}
            </Overlay>
            <PanelContainer>
                <MainTitle>Создание группы</MainTitle>
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
                        <Button type="submit">Создать</Button>
                    </FormContainer>
                </ContainerPanel>
                <ButtonClosePanel onClick={togglePanel}>
                    Закрыть панель
                </ButtonClosePanel>
            </PanelContainer>
        </>,
        document.body,
    )
}

export default PanelCreateGroup
