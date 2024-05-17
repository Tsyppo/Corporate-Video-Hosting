import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import axios from 'axios'
import { User } from '../types/user'

const slideOut = keyframes`
    0% {
        opacity: 1;
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-100%);
    }
`

const UserListContainer = styled.div`
    background-color: ${(props) => props.theme.headerBackground};
    transition: background-color 0.3s ease;
    position: fixed;
    top: 0;
    z-index: 100;
    right: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    background-color: ${(props) => props.theme.headerBackground};
    padding: 20px;
    margin-top: 170px;
    margin-right: 300px;
    margin-bottom: 100px;
    overflow-y: auto;
    border-radius: 15px; /* Радиус скругления у контейнера */
    max-height: calc(100vh - 270px);
`
const MainTitle = styled.h3`
    font-size: 22px;
    margin-top: 20px;
    text-align: center;
    color: ${(props) => props.theme.text};
`

const UserItem = styled.div<{ animate: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    animation: ${({ animate }) => (animate ? slideOut : 'none')} 0.3s ease
        forwards;
`

const RemoveButton = styled.button`
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
        background-color: black;
    }
`

interface UserListProps {
    users: User[]
    groupId: number
    onUserRemoved: (userId: number) => void
}

const UserList: React.FC<UserListProps> = ({
    users,
    groupId,
    onUserRemoved,
}) => {
    const [userList, setUserList] = useState(
        users.map((user) => ({ ...user, animate: false })),
    )

    const handleRemoveUser = async (userId: number) => {
        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/groups/${groupId}/remove-from-members/`,
                { userId },
            )
            setUserList((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, animate: true } : user,
                ),
            )
            setTimeout(() => {
                setUserList((prevUsers) =>
                    prevUsers.filter((user) => user.id !== userId),
                )
                onUserRemoved(userId)
            }, 300)
        } catch (error) {
            console.error('Error removing user:', error)
        }
    }

    return (
        <UserListContainer>
            <MainTitle>Пользователи группы</MainTitle>
            {userList.map((user) => (
                <UserItem key={user.id} animate={user.animate}>
                    <span>{user.username}</span>
                    <RemoveButton onClick={() => handleRemoveUser(user.id)}>
                        Удалить
                    </RemoveButton>
                </UserItem>
            ))}
        </UserListContainer>
    )
}

export default UserList
