import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from '../components/TokenChecker'
import AvatarIcon from '../assets/images/avatar.png'
import { useNavigate } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'
import { useActions } from '../hooks/useAction'

const ProfileContainer = styled.div`
    display: flex;
    background-color: #1e1e1e;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    color: #fff;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    margin-top: 40px;
`

const LeftPanel = styled.div`
    background: linear-gradient(135deg, #333333, #444444, #555555);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    text-align: center;
`

const Avatar = styled.img`
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: 4px solid #fff;
`

const Name = styled.h2`
    margin: 20px 0 10px;
`

const Role = styled.h3`
    margin-bottom: 20px;
    font-weight: 400;
`

const EditProfile = styled.a`
    margin-top: 20px;
    color: #fff;
    text-decoration: none;
    border: 1px solid #fff;
    padding: 5px 10px;
    border-radius: 5px;
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`

const RightPanel = styled.div`
    flex: 1;
    padding: 20px;
`

const SectionTitle = styled.h3`
    margin-bottom: 10px;
    font-size: 1.4em;
    border-bottom: 1px solid #444;
    padding-bottom: 5px;
`

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
`

const InfoLabel = styled.div`
    font-weight: 700;
`

const InfoValue = styled.div`
    color: #ccc;
`

const SocialLinks = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 15px;
`

const SocialLink = styled.a`
    color: #fff;
    font-size: 1.5em;
    transition: color 0.3s;
    &:hover {
        color: #12c2e9;
    }
`

const Profile: React.FC = () => {
    useAutoLogout()
    const { fetchUserProfile } = useActions()
    const userProfile = useTypedSelector(
        (state) => state.userprofiles.userProfile,
    )

    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    const users = useTypedSelector((state) => state.user.users)
    const { fetchListUser } = useActions()

    useEffect(() => {
        fetchListUser()
    }, [])

    let loggedInUser = null

    if (userId && users) {
        loggedInUser = users.find((user) => user.id === userId)
    }

    let id = loggedInUser?.id
    let username = loggedInUser?.username
    let role = loggedInUser?.role
    let first_name = loggedInUser?.first_name
    let last_name = loggedInUser?.last_name
    let patronymic = loggedInUser?.patronymic
    let registration_date = loggedInUser?.registration_date
    let phone_number = loggedInUser?.phone_number
    let email = loggedInUser?.email

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

    useEffect(() => {
        fetchUserProfile(userId!)
    }, [])

    return (
        <Layout>
            <TokenChecker targetRoute="/profile"></TokenChecker>
            <ProfileContainer>
                <LeftPanel>
                    <Avatar src={AvatarIcon} alt="User Avatar" />
                    <Name>
                        {first_name} {last_name}
                    </Name>
                    <Role>{role}</Role>
                    <EditProfile href="#">Изменить профиль</EditProfile>
                </LeftPanel>
                <RightPanel>
                    <SectionTitle>Информация</SectionTitle>
                    <InfoRow>
                        <InfoLabel>Полное имя:</InfoLabel>
                        <InfoValue>
                            {first_name} {last_name} {patronymic}
                        </InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>Логин:</InfoLabel>
                        <InfoValue>{username}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>Почта:</InfoLabel>
                        <InfoValue>{email}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>Телефон:</InfoLabel>
                        <InfoValue>{phone_number}</InfoValue>
                    </InfoRow>

                    <InfoRow>
                        <InfoLabel>Дата регистрации:</InfoLabel>
                        <InfoValue>{formattedDate}</InfoValue>
                    </InfoRow>
                </RightPanel>
            </ProfileContainer>
        </Layout>
    )
}

export default Profile
