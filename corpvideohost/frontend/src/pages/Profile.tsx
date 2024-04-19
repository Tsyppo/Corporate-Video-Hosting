import React from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from '../components/TokenChecker'
import AvatarIcon from '../assets/images/avatar.png'
import { useNavigate } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'

const Container = styled.div`
    display: flex;
`

const Avatar = styled.img`
    margin-top: 20px;
    height: 400px;
    width: 400px;
`

const UserInfo = styled.div`
    margin-top: 20px;
    margin-left: 20px;
`

const Title = styled.h1`
    color: ${(props) => props.theme.text};
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
`

const Profile: React.FC = () => {
    const navigate = useNavigate()

    useAutoLogout(30 * 60 * 1000, () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    })

    const userString = localStorage.getItem('user')
    const { user } = useTypedSelector((state) => state.user)

    let userObjectFromStorage

    if (userString !== null) {
        userObjectFromStorage = JSON.parse(userString)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    let username = userObjectFromStorage?.username
    let role = userObjectFromStorage?.role
    let first_name = userObjectFromStorage?.first_name
    let last_name = userObjectFromStorage?.last_name
    let patronymic = userObjectFromStorage?.patronymic
    let registration_date = userObjectFromStorage?.registration_date
    let phone_number = userObjectFromStorage?.phone_number

    let formattedDate = ''
    if (registration_date) {
        const date = new Date(registration_date)
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
        formattedDate = date.toLocaleDateString('ru-RU', options)
    }
    console.log(formattedDate)
    return (
        <Layout>
            <TokenChecker targetRoute="/profile"></TokenChecker>
            <Container>
                <Avatar src={AvatarIcon}></Avatar>
                <UserInfo>
                    <Title>Имя: {username}</Title>
                    <Title>
                        ФИО: {first_name} {last_name} {patronymic}
                    </Title>
                    <Title>Роль: {role}</Title>
                    <Title>Время регистрации: {formattedDate}</Title>
                    <Title>Номер телефона: {phone_number}</Title>
                </UserInfo>
            </Container>
            <Button>Изменить профиль</Button>
        </Layout>
    )
}

export default Profile
