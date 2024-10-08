import React, { Dispatch, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Video as VideoType } from '../types/video'
import Layout from '../components/Layout'
import styled from 'styled-components'
import TokenChecker from '../components/TokenChecker'
import CommentItems from '../components/CommentItems'
import useAutoLogout from '../hooks/useAutoLogout'
import { useActions } from '../hooks/useAction'
import VideoPlayer from '../components/VideoPlayer'
import PanelAnalytics from '../components/PanelAnalytics'
import { User } from '../types/user'

const Container = styled.div`
    margin-left: 150px;
`

const VideoTitle = styled.h1`
    margin: 0;
    color: ${(props) => props.theme.text};
`
const CommentTitle = styled(VideoTitle)``

const VideoPlace = styled.video`
    height: 715px;
    padding-top: 30px;
`

const Textarea = styled.textarea`
    width: 600px;
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
        color: ${(props) => props.theme.text};
        font-size: 16px;
    }
`

const Text = styled.h4`
    color: ${(props) => props.theme.text};
`

const Button = styled.button`
    height: 40px;
    font-size: medium;
    margin-left: 10px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`

const ButtonAnaliz = styled(Button)`
    margin-left: auto;
    margin-right: 10px;
`

const ButtonAddFav = styled(ButtonAnaliz)<{ isFavorited: boolean }>`
    margin-left: 0;
    background-color: ${(props) =>
        props.isFavorited ? '#000000' : props.theme.headerBackground};
`

const ButtonAddFavForUser = styled(ButtonAnaliz)<{ isFavorited: boolean }>`
    margin-left: auto;
    background-color: ${(props) =>
        props.isFavorited ? '#000000' : props.theme.headerBackground};
`

const FlexContainer = styled.form`
    display: flex;
    position: relative;
    margin-top: 20px;
`

const ContainerVideo = styled.div`
    display: flex;
    margin-top: 20px;
    align-items: center;
    width: 1160px;
`

const Video: React.FC = () => {
    useAutoLogout()
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    const { users } = useTypedSelector((state) => state.user)
    const { id } = useParams<{ id?: string }>()
    const parsedId = id ? parseInt(id, 10) : undefined
    const videos = useTypedSelector((state) => state.video.videos)
    const comments = useTypedSelector((state) => state.comment.comments)
    const userProfile = useTypedSelector(
        (state) => state.userprofiles.userProfile,
    )
    const [commentText, setCommentText] = useState('')
    const [isFavorited, setIsFavorited] = useState(false)
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [viewedVideoId, setViewedVideoId] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            // Получаем текущий список просмотренных видео из локального хранилища
            const viewedVideoIdsString = localStorage.getItem('viewedVideoIds')
            let viewedVideoIds: string[] = viewedVideoIdsString
                ? JSON.parse(viewedVideoIdsString)
                : []

            // Если текущее видео уже было просмотрено, удаляем его из списка
            const index = viewedVideoIds.indexOf(id)
            if (index !== -1) {
                viewedVideoIds.splice(index, 1)
            }

            // Добавляем текущее видео в конец списка просмотренных
            viewedVideoIds.push(id)

            // Обновляем значение в локальном хранилище
            localStorage.setItem(
                'viewedVideoIds',
                JSON.stringify(viewedVideoIds),
            )
        }
    }, [id])

    const {
        addComment,
        fetchComments,
        fetchUserProfile,
        fetchVideoList,
        updateUserProfile,
        fetchAnalytics,
    } = useActions()

    const togglePanel = () => {
        fetchAnalytics()
        setIsPanelOpen(!isPanelOpen)
    }

    let loggedInUser: User | null = null

    if (userId && users) {
        const foundUser = users.find((user) => user.id === userId)
        if (foundUser) {
            loggedInUser = foundUser
        }
    }

    let role = loggedInUser?.role

    if (!id) {
        return <div>Video ID is not provided</div>
    }

    useEffect(() => {
        fetchVideoList()
        if (parsedId) {
            fetchComments(parsedId)
        } else {
            console.error('fetchComments ID is null')
        }
        fetchUserProfile(userId!)
    }, [])

    useEffect(() => {
        if (userProfile && userProfile.favorites.includes(parseInt(id))) {
            setIsFavorited(true)
        } else {
            setIsFavorited(false)
        }
    }, [userProfile])

    if (!videos) {
        return (
            <Layout>
                <div>Video loading...</div>
            </Layout>
        )
    }

    const video: VideoType | undefined = videos?.find(
        (video) => video.id === parseInt(id, 10),
    )

    if (!video) {
        return (
            <Layout>
                <div>Video not found</div>
            </Layout>
        )
    }

    const handleAddFavorite = () => {
        if (!userProfile || !id) return

        setIsFavorited(!isFavorited)

        updateUserProfile(userProfile.id, parseInt(id))
    }

    if (!comments) {
        return <div>Comments loading...</div>
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!commentText.trim()) {
            console.error('Please fill in the comment field')
            return
        }

        const formData = new FormData()
        formData.append('text', commentText)
        formData.append('liked_by_user', 'false')
        formData.append('likes_count', '0')
        formData.append('user', userId!.toString() ?? '')
        formData.append('video', id ?? '')
        formData.append('parent_comment', '')
        addComment(formData)
        setCommentText('')
    }
    const scaleFactor = 0.9
    return (
        <Layout>
            <TokenChecker targetRoute={`/video/${video.id}`}></TokenChecker>
            <Container>
                <VideoPlayer
                    video={video}
                    controls={true}
                    width={1280 * scaleFactor}
                    height={720 * scaleFactor}
                    detail={true}
                ></VideoPlayer>
                <ContainerVideo>
                    <VideoTitle>{video.title}</VideoTitle>
                    {userId === video.creator || role === 'admin' ? (
                        <>
                            <ButtonAnaliz onClick={togglePanel}>
                                Аналитика
                            </ButtonAnaliz>
                            <ButtonAddFav
                                id="ButtonAddFav"
                                onClick={handleAddFavorite}
                                isFavorited={isFavorited}
                            >
                                {isFavorited
                                    ? 'Удалить из избранного'
                                    : 'Добавить в избранное'}
                            </ButtonAddFav>
                        </>
                    ) : (
                        <ButtonAddFavForUser
                            id="ButtonAddFav"
                            onClick={handleAddFavorite}
                            isFavorited={isFavorited}
                        >
                            {isFavorited
                                ? 'Удалить из избранного'
                                : 'Добавить в избранное'}
                        </ButtonAddFavForUser>
                    )}
                    <PanelAnalytics
                        isPanelOpen={isPanelOpen}
                        togglePanel={togglePanel}
                        id={parsedId}
                    />
                </ContainerVideo>
                <Text>{video.description}</Text>
                <CommentTitle>Комментарии</CommentTitle>
                <FlexContainer onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="Комментарий"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button type="submit">Отправить комментарий</Button>
                </FlexContainer>
                {comments
                    .filter((comment) => comment.parent_comment === null)
                    .map((comment) => (
                        <CommentItems key={comment.id} comment={comment} />
                    ))}
            </Container>
        </Layout>
    )
}

export default Video
