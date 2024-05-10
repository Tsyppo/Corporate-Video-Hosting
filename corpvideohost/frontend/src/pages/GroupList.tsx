import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import AvatarIcon from '../assets/images/avatar.png'
import TokenChecker from '../components/TokenChecker'
import ReactDOM from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'
import { Group } from '../types/group'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { fetchGroupList, uploadGroup } from '../store/actions/groupActions'
import { useDispatch } from 'react-redux'
import { useActions } from '../hooks/useAction'
import PanelCreateGroup from '../components/PanelCreateGroup'
import { User } from '../types/user'

const Container = styled.div`
    margin-left: 300px;
    display: flex;
    flex-direction: column;
`

const GroupContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
`

const Avatar = styled.img`
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-right: 20px;
    margin-top: 20px;
`

const GroupInfo = styled.div`
    display: flex;
    flex-direction: column;
`

const GroupName = styled.h2`
    color: ${(props) => props.theme.text};
    margin-bottom: 12px;
`
const GroupCreator = styled.h4`
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 13px;
    color: ${(props) => props.theme.text};
`

const Participants = styled.h4`
    margin-top: 0;
    font-size: 13px;
    color: ${(props) => props.theme.text};
`

const Button = styled.button`
    height: 40px;
    width: 170px;
    font-size: medium;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
`

const ButtonForWait = styled(Button)`
    background-color: ${(props) => props.theme.playlistobject};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &:hover {
        background-color: black;
    }
`

const PForCreator = styled.p`
    height: 20px;
    width: 170px;
    font-size: medium;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    background-color: ${(props) => props.theme.playlistobject};
    color: ${(props) => props.theme.headerText};
    border: none;
    border-radius: 5px;
    text-align: center;
    padding-top: 12px;
    padding-bottom: 12px;
`

const ButtonAddGroup = styled(Button)`
    margin-left: 300px;
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

const GroupList: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'public', // Устанавливаем начальное значение статуса
    })
    useAutoLogout()
    const { users } = useTypedSelector((state) => state.user)
    const { groups } = useTypedSelector((state) => state.group)

    const { applyToGroup, cancelApplication, fetchListUser, fetchGroupList } =
        useActions()

    useEffect(() => {
        fetchListUser()
        fetchGroupList()
    }, [])

    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null

    let loggedInUser: User | null = null

    if (userId && users) {
        const foundUser = users.find((user) => user.id === userId)
        if (foundUser) {
            loggedInUser = foundUser
        }
    }

    let role = loggedInUser?.role

    const [isPanelOpen, setIsPanelOpen] = useState(false)

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen)
    }

    const getCreatorName = (creatorId: number) => {
        // Ищем пользователя с указанным ID в списке пользователей
        const creator = users?.find((user) => user.id === creatorId)
        if (creator) {
            return creator.username // Возвращаем имя пользователя, если найден
        }
        return 'Неизвестный пользователь'
    }
    // Функция для обработки подачи заявки на вступление в группу
    const handleApplyToGroup = (groupId: number) => {
        const userId = loggedInUser?.id // Получаем ID пользователя из localStorage
        if (userId) {
            // Передаем ID пользователя и ID группы в действие applyToGroup
            applyToGroup(groupId, [userId])
            console.log(`Applied to group ${groupId}`)
        } else {
            console.error('User ID not found in localStorage')
        }
    }

    const handleCancelToGroup = (groupId: number) => {
        const userId = loggedInUser?.id // Получаем ID пользователя из localStorage
        if (userId) {
            // Передаем ID пользователя и ID группы в действие applyToGroup
            cancelApplication(groupId, userId)
            console.log(`Canceled to group ${groupId}`)
        } else {
            console.error('User ID not found in localStorage')
        }
    }

    const renderApplyButton = (group: Group) => {
        // Проверяем, если пользователь уже в группе или в списке ожидающих, не показываем кнопку
        if (group.creator == loggedInUser?.id) {
            return <PForCreator>Вы создатель</PForCreator>
        }
        if (group.waiting.includes(loggedInUser?.id!)) {
            return (
                <ButtonForWait onClick={() => handleCancelToGroup(group.id)}>
                    Отменить заявку
                </ButtonForWait>
            )
        }
        if (group.members.includes(loggedInUser?.id!)) {
            return <PForCreator>Вы в группе</PForCreator>
        }
        return (
            <Button onClick={() => handleApplyToGroup(group.id)}>
                Подать заявку
            </Button>
        )
    }

    return (
        <Layout>
            <TokenChecker targetRoute="/groups"></TokenChecker>
            <>
                {role === 'manager' || role === 'admin' ? (
                    <ButtonAddGroup onClick={togglePanel}>
                        Создание группы
                    </ButtonAddGroup>
                ) : null}
                <PanelCreateGroup
                    isPanelOpen={isPanelOpen}
                    togglePanel={togglePanel}
                />
            </>
            <Container>
                {groups ? (
                    <div>
                        {groups.map((group: Group) => (
                            <GroupContainer>
                                <Avatar src={AvatarIcon} />
                                <GroupInfo>
                                    <GroupName>
                                        {group.members.includes(
                                            loggedInUser?.id!,
                                        ) ? (
                                            <StyledLink
                                                to={`/group/${group.id}`}
                                            >
                                                {group.title}
                                            </StyledLink>
                                        ) : group.creator ===
                                          loggedInUser?.id ? (
                                            <StyledLink
                                                to={`/group/${group.id}`}
                                            >
                                                {group.title}
                                            </StyledLink>
                                        ) : (
                                            <span>{group.title}</span>
                                        )}
                                    </GroupName>
                                    <GroupCreator>
                                        Создатель:{' '}
                                        {getCreatorName(group.creator)}
                                    </GroupCreator>
                                    <Participants>
                                        {group.members ? (
                                            <>
                                                {group.members.length}{' '}
                                                участников
                                            </>
                                        ) : (
                                            <>0 участников</>
                                        )}
                                    </Participants>
                                </GroupInfo>
                                {renderApplyButton(group)}
                            </GroupContainer>
                        ))}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </Container>
        </Layout>
    )
}

export default GroupList
