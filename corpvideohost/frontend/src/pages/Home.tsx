import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from '../components/TokenChecker'
import { useNavigate } from 'react-router-dom'
import useAutoLogout from '../hooks/useAutoLogout'
import { fetchGroupList } from '../store/actions/groupActions'
import GroupItem from '../components/GroupItem'

const Title = styled.h1`
    color: ${(props) => props.theme.text};
    margin-top: 300px;
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

const Home: React.FC = () => {
    const navigate = useNavigate()
    useAutoLogout()
    const { groups } = useTypedSelector((state) => state.group)

    useEffect(() => {
        fetchGroupList()
    }, [])

    const userString = localStorage.getItem('user')

    const handleButtonClick = () => {
        navigate('/groups')
    }

    return (
        <Layout>
            <TokenChecker targetRoute="/main"></TokenChecker>
            {groups && groups.length === 0 ? (
                <div>
                    <Title>
                        Здесь будут отображаться группы в которых вы состоите!
                    </Title>
                    <Button onClick={handleButtonClick}>
                        Перейти к списку групп
                    </Button>
                </div>
            ) : (
                <GroupItem></GroupItem>
            )}
        </Layout>
    )
}

export default Home
