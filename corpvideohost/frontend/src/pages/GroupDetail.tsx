import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import styled from 'styled-components'
import ReactDOM from 'react-dom'
import VideoItems from '../components/VideoItems'
import PlaylistItem from '../components/PlaylistItem'
import TokenChecker from '../components/TokenChecker'
import { useTypedSelector } from '../hooks/useTypedSelector'
import useAutoLogout from '../hooks/useAutoLogout'
import PanelCreatePlaylist from '../components/PanelCreatePlaylist'
import { fetchGroupList } from '../store/actions/groupActions'
import { useDispatch } from 'react-redux'
import PanelAddVideo from '../components/PanelAddVideo'

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

const MainTitle = styled.h1`
    color: ${(props) => props.theme.text};
`

const Group: React.FC = () => {
    useAutoLogout()

    const userString = localStorage.getItem('user')

    if (userString !== null) {
        const userObjectFromStorage = JSON.parse(userString)
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
    const [isPanelAddVideoOpen, setIsPanelAddVideoOpen] = useState(false)
    const [isPanelPlaylistOpen, setIsPanelPlaylistOpen] = useState(false)

    const togglePanelAddVideo = () => {
        setIsPanelAddVideoOpen(!isPanelAddVideoOpen)
    }

    const togglePanelPlaylist = () => {
        setIsPanelPlaylistOpen(!isPanelPlaylistOpen)
    }

    const { id } = useParams<{ id?: string }>()

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
                    <VipButton>Просмотр заявок</VipButton>
                ) : null}
                <PanelCreatePlaylist
                    isPanelOpen={isPanelPlaylistOpen}
                    togglePanelPlaylist={togglePanelPlaylist}
                    groupId={group.id}
                />
                <PanelAddVideo
                    isPanelOpen={isPanelAddVideoOpen}
                    togglePanelAddVideo={togglePanelAddVideo}
                    groupId={group.id}
                />
            </>
            <PlaylistItem groupId={group.id} />
            <VideoItems groupId={group.id} />
        </Layout>
    )
}

export default Group
