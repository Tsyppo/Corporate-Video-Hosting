import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import useAutoLogout from '../hooks/useAutoLogout'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'

const Button = styled.button`
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

const ButtonClosePanel = styled(Button)`
    margin-top: 60px;
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

const MainTitle = styled.h1`
    text-align: center;
    color: white;
`
const ScrollableContainer = styled.div`
    display: flex;
    min-height: 400px;
    max-height: 401px;
    overflow-y: auto;
`

const StyledList = styled.ul`
    list-style-type: none;
`

const ListItem = styled.li`
    display: flex;
    width: 210%;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
`

const UserName = styled.span`
    font-weight: bold;
`
const ActionButtonsContainer = styled.div`
    display: flex;
    align-items: center;
`
const ActionAcceptButton = styled.button`
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;

    transition: background-color 0.3s ease;
    transition: color 0.3s ease;
    margin-left: auto;
    &:hover {
        background-color: black;
        color: white;
    }
`

const ActionCancelButton = styled(ActionAcceptButton)`
    margin-left: 0;

    &:hover {
        background-color: #ff0000;
    }
`
const PanelViewWaitingUserList: React.FC<{
    isPanelOpen: boolean
    togglePanelViewWaitingUserList: () => void
    groupId: number
}> = ({ isPanelOpen, togglePanelViewWaitingUserList, groupId }) => {
    useAutoLogout()

    const {
        fetchListUser,
        fetchVideoListUser,
        addToMembers,
        cancelApplication,
    } = useActions()

    const [actionInProgress, setActionInProgress] = useState<boolean>(false)

    const { users } = useTypedSelector((state) => state.user)
    const { groups } = useTypedSelector((state) => state.group)
    const videos = useTypedSelector((state) => state.video.videos)

    const user = localStorage.getItem('user')
    let userObjectFromStorage: any | null = null
    if (user !== null) {
        userObjectFromStorage = JSON.parse(user)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    useEffect(() => {
        fetchListUser()
    }, [])

    useEffect(() => {
        fetchVideoListUser(userObjectFromStorage.id)
    }, [])

    const waitingUsers =
        groups?.find((group) => group.id === groupId)?.waiting || [] // Получаем список ожидающих пользователей для данной группы

    const getCreatorName = (creatorId: number) => {
        // Ищем пользователя с указанным ID в списке пользователей
        const creator = users?.find((user) => user.id === creatorId)
        if (creator) {
            return creator.username // Возвращаем имя пользователя, если найден
        }
        return 'Неизвестный пользователь'
    }
    const items = [...Array(100)].map((val, i) => `Item ${i}`)

    const handleAccept = async (userId: number) => {
        try {
            // Устанавливаем флаг actionInProgress в true, чтобы предотвратить многократные запросы
            setActionInProgress(true)

            // Вызываем действие addToMembers
            await addToMembers(groupId, userId)

            await cancelApplication(groupId, userId)

            // Устанавливаем флаг actionInProgress в false после завершения запроса
            setActionInProgress(false)
        } catch (error) {
            console.error('Error accepting application:', error)
            setActionInProgress(false)
        }
    }

    const handleReject = async (userId: number) => {
        try {
            // Устанавливаем флаг actionInProgress в true, чтобы предотвратить многократные запросы
            setActionInProgress(true)

            // Вызываем действие cancelApplication
            await cancelApplication(groupId, userId)

            // Устанавливаем флаг actionInProgress в false после завершения запроса
            setActionInProgress(false)
        } catch (error) {
            // Обрабатываем ошибку, если есть
            console.error('Error rejecting application:', error)

            // Устанавливаем флаг actionInProgress в false в случае ошибки
            setActionInProgress(false)
        }
    }

    if (!isPanelOpen) return null

    return ReactDOM.createPortal(
        <>
            <Overlay>
                <OverlayContent onClick={togglePanelViewWaitingUserList} />{' '}
            </Overlay>
            <PanelContainer>
                <MainTitle>Просмотр заявок</MainTitle>
                <ScrollableContainer>
                    <StyledList>
                        {waitingUsers.map((userId) => (
                            <ListItem key={userId}>
                                <UserName>{getCreatorName(userId)}</UserName>
                                <ActionButtonsContainer>
                                    <ActionAcceptButton
                                        onClick={() => handleAccept(userId)}
                                    >
                                        Принять
                                    </ActionAcceptButton>
                                    <ActionCancelButton
                                        onClick={() => handleReject(userId)}
                                    >
                                        Отклонить
                                    </ActionCancelButton>
                                </ActionButtonsContainer>
                            </ListItem>
                        ))}
                    </StyledList>
                </ScrollableContainer>
                <ButtonClosePanel onClick={togglePanelViewWaitingUserList}>
                    Закрыть панель
                </ButtonClosePanel>
            </PanelContainer>
        </>,
        document.body,
    )
}

export default PanelViewWaitingUserList
