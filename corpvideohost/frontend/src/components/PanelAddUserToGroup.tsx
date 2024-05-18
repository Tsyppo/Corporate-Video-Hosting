import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useActions } from '../hooks/useAction'
import { Video } from '../types/video'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Group } from '../types/group'
import axios from 'axios'
import { User } from '../types/user'

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
    max-height: 200px;
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

const PanelAddUserToGroup: React.FC<{
    isPanelOpen: boolean
    togglePanelAddVideo: () => void
    groupId: number
}> = ({ isPanelOpen, togglePanelAddVideo, groupId }) => {
    const { updateGroup, fetchListUser } = useActions()

    const users = useTypedSelector((state) => state.user.users)
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null

    useEffect(() => {
        fetchListUser()
    }, [])

    const handleCheckboxChange = (user: User) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(user)
                ? prevSelectedUsers.filter((v) => v !== user)
                : [...prevSelectedUsers, user],
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const response = await axios.get<Group>(
                `http://127.0.0.1:8000/api/groups/${groupId}/`,
            )
            const currentGroup = response.data

            const updatedMemberIds = Array.from(
                new Set([
                    ...currentGroup.members,
                    ...selectedUsers.map((user) => user.id),
                ]),
            )

            updateGroup(groupId, {
                members: updatedMemberIds,
            } as Partial<Group>)
        } catch (error) {
            console.error('Error fetching group:', error)
        }
    }

    if (!users) {
        return <div>Пользователь не найдена</div>
    }

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (!isPanelOpen) return null

    return ReactDOM.createPortal(
        <>
            <Overlay>
                <OverlayContent onClick={togglePanelAddVideo} />
            </Overlay>
            <PanelContainer>
                <MainTitle>Добавить пользователя</MainTitle>
                <ContainerPanel>
                    <FormContainer onSubmit={handleSubmit}>
                        <SearchInput
                            type="text"
                            placeholder="Поиск пользователя..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FormGroup>
                            <VideoCheckboxContainer>
                                {filteredUsers.map((user: User) => (
                                    <VideoCheckboxItem key={user.id}>
                                        <VideoCheckboxInput
                                            type="checkbox"
                                            checked={selectedUsers.includes(
                                                user,
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(user)
                                            }
                                        />
                                        <VideoCheckboxLabel>
                                            {user.username}
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

export default PanelAddUserToGroup
