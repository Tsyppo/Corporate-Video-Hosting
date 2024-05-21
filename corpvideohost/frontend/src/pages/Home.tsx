import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from '../components/TokenChecker'
import { Link, useNavigate } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'
import { useActions } from '../hooks/useAction'
import VideoSlider from '../components/VideoSlider'
import AvatarIcon from '../assets/images/avatar.png'
import { Group } from '../types/group'
import { User } from '../types/user'

const Title = styled.h1`
    color: ${(props) => props.theme.text};
    margin-top: 150px;
    margin-left: 300px;
`

const Button = styled.button`
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    margin-left: 700px;
`
const Container = styled.div`
    margin-left: 300px;
    display: flex;
    flex-direction: column;
`

const GroupContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    width: 850px;
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
    margin-top: 20px;
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

const Home: React.FC = () => {
    const navigate = useNavigate()
    useAutoLogout()

    const videos = useTypedSelector((state) => state.video.videos)
    const { groups } = useTypedSelector((state) => state.group)
    const { users } = useTypedSelector((state) => state.user)
    const [filteredGroups, setFilteredGroups] = useState<Group[]>([])

    const { fetchVideoList, applyToGroup, cancelApplication, fetchGroupList } =
        useActions()

    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    let loggedInUser: User | null = null

    if (userId && users) {
        const foundUser = users.find((user) => user.id === userId)
        if (foundUser) {
            loggedInUser = foundUser
        }
    }

    useEffect(() => {
        fetchVideoList()
        fetchGroupList()
    }, [])

    useEffect(() => {
        const filtered = groups?.filter(
            (group) =>
                group.members.includes(loggedInUser?.id!) ||
                group.creator === loggedInUser?.id,
        )

        const recentGroups = filtered?.filter((group) => {
            const creationDate = new Date(group.creation_date)
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            return creationDate >= thirtyDaysAgo
        })

        const sortedGroups = recentGroups?.sort((a, b) => {
            const dateA = new Date(a.creation_date).getTime()
            const dateB = new Date(b.creation_date).getTime()
            return dateA - dateB
        })

        setFilteredGroups(sortedGroups || [])
    }, [groups, loggedInUser])

    const scaleFactor = 0.7

    const handleButtonClick = () => {
        navigate('/groups')
    }

    const getCreatorName = (creatorId: number) => {
        const creator = users?.find((user) => user.id === creatorId)
        if (creator) {
            return creator.username
        }
        return 'Неизвестный пользователь'
    }

    const handleApplyToGroup = (groupId: number) => {
        const userId = loggedInUser?.id
        if (userId) {
            applyToGroup(groupId, [userId])
            console.log(`Applied to group ${groupId}`)
        } else {
            console.error('User ID not found in localStorage')
        }
    }

    const handleCancelToGroup = (groupId: number) => {
        const userId = loggedInUser?.id
        if (userId) {
            cancelApplication(groupId, userId)
            console.log(`Canceled to group ${groupId}`)
        } else {
            console.error('User ID not found in localStorage')
        }
    }

    const renderApplyButton = (group: Group) => {
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
            <TokenChecker targetRoute="/main"></TokenChecker>
            <VideoSlider></VideoSlider>
            {filteredGroups?.length === 0 ? (
                <div>
                    <Title>
                        Здесь будут отображаться группы в которых вы состоите!
                    </Title>
                    <Button onClick={handleButtonClick}>
                        Перейти к списку групп
                    </Button>
                </div>
            ) : (
                <Container>
                    {filteredGroups ? (
                        <div>
                            {filteredGroups.map((group: Group) => (
                                <GroupContainer>
                                    <Avatar src={AvatarIcon} alt="AvatarIcon" />
                                    <GroupInfo>
                                        <GroupName id="GroupName">
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
                                                    Участников группы:{' '}
                                                    {group.members.length}
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
            )}
        </Layout>
    )
}

export default Home
