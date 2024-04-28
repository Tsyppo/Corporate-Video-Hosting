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

const ButtonAddFav = styled(Button)`
    margin-left: 20px;
`

const ButtonAnaliz = styled(ButtonAddFav)`
    margin-left: 710px;
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
`

const Video: React.FC = () => {
    useAutoLogout()

    const { id } = useParams<{ id?: string }>()
    const videos = useTypedSelector((state) => state.video.videos)
    const [commentText, setCommentText] = useState('')
    const { addComment, fetchComments, fetchVideoListUser } = useActions()
    const comments = useTypedSelector((state) => state.comment.comments)

    if (!id) {
        return <div>Video ID is not provided</div>
    }

    const userString = localStorage.getItem('user')
    const userObjectFromStorage = userString ? JSON.parse(userString) : null

    useEffect(() => {
        if (id) {
            fetchComments(parseInt(id))
        } else {
            console.error('fetchComments ID is null')
        }
    }, [])

    useEffect(() => {
        if (id) {
            fetchVideoListUser(parseInt(id))
        } else {
            console.error('fetchVideo ID is null')
        }
    }, [])

    if (!comments) {
        return <div>Comments loading...</div>
    }

    if (!videos) {
        return <div>Video loading...</div>
    }

    const video: VideoType | undefined = videos.find(
        (video) => video.id === parseInt(id, 10),
    )

    if (!video) {
        return <div>Video not found</div>
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
        formData.append('user', userObjectFromStorage?.id.toString() ?? '')
        formData.append('video', id ?? '')
        formData.append('parent_comment', '')
        addComment(formData)
        setCommentText('')
    }

    return (
        <Layout>
            <TokenChecker targetRoute={`/video/${video.id}`}></TokenChecker>
            <Container>
                <VideoPlace controls>
                    <source src={video.video} type="video/mp4" />
                    Your browser does not support the video.
                </VideoPlace>
                <ContainerVideo>
                    <VideoTitle>{video.title}</VideoTitle>
                    <ButtonAnaliz>Аналитика</ButtonAnaliz>
                    <ButtonAddFav>Добавить в избранное</ButtonAddFav>
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
