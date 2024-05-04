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
    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
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

    const dispatch = useDispatch()
    const { groups } = useTypedSelector((state) => state.group)

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchGroupList()(dispatch)
            } catch (error) {
                console.error('Error fetching group list:', error)
            }
        }

        fetchData()
    }, [dispatch])

    const user = localStorage.getItem('user')
    let userObjectFromStorage: any | null = null

    if (user !== null) {
        userObjectFromStorage = JSON.parse(user)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    let role = userObjectFromStorage?.role

    const [isPanelOpen, setIsPanelOpen] = useState(false)

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen)
    }
    const getCreatorName = (creatorId: number) => {
        if (userObjectFromStorage && userObjectFromStorage.id === creatorId) {
            return userObjectFromStorage.username
        }
        return 'Неизвестный пользователь'
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
                                        <StyledLink to={`/group/${group.id}`}>
                                            {group.title}
                                        </StyledLink>
                                    </GroupName>
                                    <GroupCreator>
                                        <StyledLink to={`/group/${group.id}`}>
                                            Создатель:{' '}
                                            {getCreatorName(group.creator)}
                                        </StyledLink>
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
                                <Button>Подать заявку</Button>
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
