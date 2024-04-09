import React, { Suspense } from 'react'
import Layout from '../components/Layout'

import { useActions } from '../hooks/useAction'

import styled from 'styled-components'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { englishLocale, russianLocale } from '../theme/locales'
import VideoPlayer from '../components/VideoPlayer'
import TokenChecker from '../components/TokenChecker'

const Title = styled.h1`
    color: ${(props) => props.theme.text};
`
const Button = styled.button`
    background-color: ${(props) => props.theme.primary};
    color: #000000;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
`

const Home: React.FC = () => {
    const { language } = useTypedSelector((state) => state.settings)
    const locale = language === 'en' ? englishLocale : russianLocale
    const { user } = useTypedSelector((state) => state.user)

    return (
        <Layout>
            <TokenChecker></TokenChecker>
            <Title>{locale.homeTitle}</Title>

            <VideoPlayer></VideoPlayer>
        </Layout>
    )
}

export default Home
