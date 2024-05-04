import React, { useEffect, useState } from 'react'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styled from 'styled-components'
import { useActions } from '../hooks/useAction'
import { Comment as CommentType } from '../types/comment'
import AvatarIcon from '../assets/images/avatar.png'
import { useParams } from 'react-router-dom'

const Avatar = styled.img`
    height: 50px;
    width: 50px;
    border-radius: 50%;
`

const CommentContainer = styled.div`
    margin-top: 20px;
    padding: 15px;
    border-radius: 8px;
    position: relative;
`

const FlexContainer = styled.div`
    display: flex;
    position: relative;
`

const FlexContainerAnswer = styled.div`
    display: flex;
    position: relative;
`

const CommentText = styled.div`
    margin-bottom: 10px;
    color: ${(props) => props.theme.text};
`

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    padding-bottom: 15px;
`

const UserName = styled.span`
    color: ${(props) => props.theme.text};
    font-weight: bold;
    margin-right: 8px;
    font-size: 20px;
`

const CommentMeta = styled.div`
    color: ${(props) => props.theme.text};
    font-size: 14px;
    display: flex;
    align-items: center;
`

const CommentButton = styled.button`
    padding: 6px 12px;
    margin-top: 10px;
    border: none;
    border-radius: 4px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
`

const AvatarContainer = styled.div`
    top: 0;
    left: 0;
    padding-right: 15px;
`

const CommentReplyForm = styled.form`
    margin-top: 10px;
    display: flex;
    position: relative;
`

const Textarea = styled.textarea`
    width: 400px;
    height: 80px;
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

const Button = styled.button`
    height: 30px;
    margin-left: 10px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;

    border: none;
    border-radius: 5px;
    cursor: pointer;
`

const Answer = styled.div`
    margin-top: 10px;
    margin-left: 80px;
`

const CommentItems: React.FC<{ comment: CommentType }> = ({ comment }) => {
    const { fetchListUser, addComment } = useActions()
    const users = useTypedSelector((state) => state.user.users)
    const [replyingTo, setReplyingTo] = useState<number | null>(null)
    const [replyText, setReplyText] = useState('')
    const { id } = useParams<{ id?: string }>()

    const comments = useTypedSelector((state) => state.comment.comments)
    useEffect(() => {
        fetchListUser()
    }, [])

    if (!comments || !users) {
        return <div>Loading...</div>
    }

    const userObjectFromStorage = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')!)
        : null

    const currentUser = users.find((user) => user.id === comment.user)

    const handleReply = (commentId: number) => {
        setReplyingTo((prev) => (prev === commentId ? null : commentId))
    }

    const handleSubmitReply = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!replyText.trim()) {
            console.error('Please fill in the reply field')
            return
        }

        const formData = new FormData()
        formData.append('text', replyText)
        formData.append('liked_by_user', 'false')
        formData.append('likes_count', '0')
        formData.append('user', userObjectFromStorage?.id.toString() ?? '')
        formData.append('video', id ?? '')
        formData.append('parent_comment', replyingTo?.toString() ?? '')

        addComment(formData)
        setReplyText('')
        setReplyingTo(null)
    }

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString)
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
        return date.toLocaleDateString('ru-RU', options)
    }

    return (
        <div>
            <CommentContainer>
                <FlexContainer>
                    <AvatarContainer>
                        <Avatar src={AvatarIcon} />
                    </AvatarContainer>
                    <div>
                        <UserInfo>
                            <UserName>
                                {currentUser ? currentUser.username : 'Unknown'}
                            </UserName>
                            <CommentMeta>
                                {formatDate(comment.created_at)}
                            </CommentMeta>
                        </UserInfo>
                        <CommentText>{comment.text}</CommentText>
                        <CommentButton onClick={() => handleReply(comment.id)}>
                            Ответить
                        </CommentButton>
                        {replyingTo === comment.id && (
                            <CommentReplyForm onSubmit={handleSubmitReply}>
                                <Textarea
                                    value={replyText}
                                    onChange={(e) =>
                                        setReplyText(e.target.value)
                                    }
                                    placeholder="Напишите ответ..."
                                />
                                <Button type="submit">Отправить</Button>
                            </CommentReplyForm>
                        )}
                    </div>
                </FlexContainer>
            </CommentContainer>
            <Answer>
                {comments
                    .filter((reply) => reply.parent_comment === comment.id)
                    .map((reply) => (
                        <FlexContainerAnswer key={reply.id}>
                            <CommentItems comment={reply} />
                        </FlexContainerAnswer>
                    ))}
            </Answer>
        </div>
    )
}

export default CommentItems
