import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import styled from 'styled-components'
import ReactDOM from 'react-dom'
import VideoItems from '../components/VideoItems'
import PlaylistItem from '../components/PlaylistItem'
import TokenChecker from '../components/TokenChecker'
import { useTypedSelector } from '../hooks/useTypedSelector'
import useAutoLogout from '../hooks/useAutoLogout'
import { fetchGroupList } from '../store/actions/groupActions'
import { useDispatch } from 'react-redux'
import { useActions } from '../hooks/useAction'
import UserList from '../components/UserList'
import { User } from '../types/user'

const LazyPanelViewWaitingUserList = React.lazy(
    () => import('../components/PanelViewWaitingUserList'),
)
const LazyPanelCreatePlaylist = React.lazy(
    () => import('../components/PanelCreatePlaylist'),
)
const LazyPanelAddVideo = React.lazy(
    () => import('../components/PanelAddVideo'),
)

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

const VipButton = styled(Button)`
    margin-right: 30px;
`

const MainTitle = styled.h1`
    font-size: 32px;
    margin-top: 20px;
    color: ${(props) => props.theme.text};
`

const Title = styled.h1`
    font-size: 24px;
    margin-top: 20px;
    color: ${(props) => props.theme.text};
`

const Group: React.FC = () => {
    const users = useTypedSelector((state) => state.user.users)
    const { groups } = useTypedSelector((state) => state.group)
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    const { fetchListUser, fetchVideoList, fetchGroupList } = useActions()

    const [isPanelAddVideoOpen, setIsPanelAddVideoOpen] = useState(false)
    const [isPanelPlaylistOpen, setIsPanelPlaylistOpen] = useState(false)
    const [isPanelViewWaitingUserListOpen, setIsPanelViewWaitingUserListOpen] =
        useState(false)
    const [groupUsers, setGroupUsers] = useState<User[]>([])

    useAutoLogout()

    useEffect(() => {
        fetchVideoList()
        fetchListUser()
        fetchGroupList()
    }, [])

    let loggedInUser = null
    if (userId && users) {
        loggedInUser = users.find((user) => user.id === userId)
    }

    let role = loggedInUser?.role

    const togglePanelAddVideo = () => {
        setIsPanelAddVideoOpen(!isPanelAddVideoOpen)
    }

    const togglePanelPlaylist = () => {
        setIsPanelPlaylistOpen(!isPanelPlaylistOpen)
    }
    const togglePanelViewWaitingUserList = () => {
        setIsPanelViewWaitingUserListOpen(!isPanelViewWaitingUserListOpen)
    }

    const { id } = useParams<{ id?: string }>()

    if (!groups) {
        return (
            <Layout>
                {' '}
                <div>Loading...</div>
            </Layout>
        )
    }

    if (!id) {
        return <div>Video ID is not provided</div>
    }

    const group = groups.find((group) => group.id === parseInt(id, 10))

    if (!group) {
        return <div>Группа не найдена</div>
    }

    const filtredGroupUsers =
        group && users
            ? (group.members
                  .map((memberId) => users.find((user) => user.id === memberId))
                  .filter(Boolean) as User[])
            : []

    const handleRemoveUser = (userId: number) => {
        setGroupUsers(groupUsers.filter((user) => user.id !== userId))
    }

    return (
        <Layout>
            <TokenChecker targetRoute={`/group/${group.id}`}></TokenChecker>
            <MainTitle>{group.title}</MainTitle>
            <>
                {role === 'manager' || role === 'admin' ? (
                    <VipButton onClick={togglePanelPlaylist}>
                        Создать плейлист
                    </VipButton>
                ) : null}
                {role === 'manager' || role === 'admin' ? (
                    <VipButton onClick={togglePanelAddVideo}>
                        Добавить видео
                    </VipButton>
                ) : null}
                {role === 'manager' || role === 'admin' ? (
                    <VipButton>Добавить пользователя</VipButton>
                ) : null}
                {role === 'manager' || role === 'admin' ? (
                    <VipButton onClick={togglePanelViewWaitingUserList}>
                        Просмотр заявок
                    </VipButton>
                ) : null}
                <Suspense fallback={<div>Loading...</div>}>
                    {isPanelViewWaitingUserListOpen && (
                        <LazyPanelViewWaitingUserList
                            isPanelOpen={isPanelViewWaitingUserListOpen}
                            togglePanelViewWaitingUserList={
                                togglePanelViewWaitingUserList
                            }
                            groupId={group.id}
                        />
                    )}
                    {isPanelPlaylistOpen && (
                        <LazyPanelCreatePlaylist
                            isPanelOpen={isPanelPlaylistOpen}
                            togglePanelPlaylist={togglePanelPlaylist}
                            groupId={group.id}
                        />
                    )}
                    {isPanelAddVideoOpen && (
                        <LazyPanelAddVideo
                            isPanelOpen={isPanelAddVideoOpen}
                            togglePanelAddVideo={togglePanelAddVideo}
                            groupId={group.id}
                        />
                    )}
                </Suspense>
            </>
            <PlaylistItem groupId={group.id} />
            <Title>Видео</Title>
            <VideoItems groupId={group.id} />
            <UserList
                users={filtredGroupUsers}
                groupId={group.id}
                onUserRemoved={handleRemoveUser}
            />{' '}
        </Layout>
    )
}

export default Group
