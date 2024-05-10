import React, { Dispatch, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Video as VideoType } from '../types/video'
import Layout from '../components/Layout'
import styled from 'styled-components'
import TokenChecker from '../components/TokenChecker'
import CommentItems from '../components/CommentItems'
import useAutoLogout from '../hooks/useAutoLogout'
import { useDispatch } from 'react-redux'
import { addComment } from '../store/actions/commentActions'
import { CommentAction } from '../types/comment'
import { useActions } from '../hooks/useAction'
import { Comment as CommentType } from '../types/comment'
import VideoPlayer from '../components/VideoPlayer'

const Container = styled.div`
    margin-left: 150px;
`

const VideoTitle = styled.h1`
    margin: 0;
    color: ${(props) => props.theme.text};
`

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
        props.isFavorited ? '#858585' : props.theme.headerBackground};
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
    const { id } = useParams<{ id?: string }>()
    const parsedId = id ? parseInt(id, 10) : undefined
    const videos = useTypedSelector((state) => state.video.videos)
    const comments = useTypedSelector((state) => state.comment.comments)
    const userProfile = useTypedSelector(
        (state) => state.userprofiles.userProfile,
    )
    const [commentText, setCommentText] = useState('')
    const [isFavorited, setIsFavorited] = useState(false)

    const {
        addComment,
        fetchComments,
        fetchUserProfile,
        fetchVideoList,
        updateUserProfile,
    } = useActions()

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
        return <div>Video loading...</div>
    }

    const video: VideoType | undefined = videos?.find(
        (video) => video.id === parseInt(id, 10),
    )

    if (!video) {
        return <div>Video not found</div>
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
                <h1></h1>
                <VideoPlayer
                    video={video}
                    controls={true}
                    width={1280 * scaleFactor}
                    height={720 * scaleFactor}
                ></VideoPlayer>
                <ContainerVideo>
                    <VideoTitle>{video.title}</VideoTitle>
                    <ButtonAnaliz>Аналитика</ButtonAnaliz>
                    <ButtonAddFav
                        onClick={handleAddFavorite}
                        isFavorited={isFavorited}
                    >
                        {isFavorited
                            ? 'Удалить из избранного'
                            : 'Добавить в избранное'}
                    </ButtonAddFav>
                </ContainerVideo>
                <Text>{video.description}</Text>
                <VideoTitle>Комментарии</VideoTitle>
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
