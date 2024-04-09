import React, { useCallback, useMemo, useState } from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import SiteIcon from '../assets/images/Panda.svg'
import BackgroundPng from '../assets/images/background.png'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { lightTheme, darkTheme } from '../theme/theme'
import { englishLocale, russianLocale } from '../theme/locales'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: cursive, sans-serif;
    background-color: ${(props) => props.theme.body};
  }

  body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${BackgroundPng});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 90px;
    z-index: -1;
    opacity: 0.1;
    @media screen and (max-width: 610px) {
        background-position: 0 90px;
    }
  }
`
const Header = styled.header`
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 20px;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    @media screen and (max-width: 1920px) {
        padding: 15px;
    }
    @media screen and (max-width: 610px) {
        flex-wrap: wrap;
    }
`
const IconPanda = styled(LazyLoadImage)`
    width: 50px;
    margin-right: 10px;
`
const Title = styled.h1`
    margin: 0 auto 0 0;
    @media screen and (max-width: 1920px) {
        font-size: 36px;
    }
`

const TitleLogin = styled(Title)`
    color: ${(props) => props.theme.text};
    @media screen and (max-width: 1920px) {
        font-size: 36px;
    }
`

const ThemeButton = styled.button`
    background-color: ${(props) => props.theme.buttonBackground};
    color: ${(props) => props.theme.buttonColor};
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
    @media screen and (max-width: 370px) {
        margin-top: 10px;
        margin-right: 20px;
    }
`

const LanguageButton = styled.button`
    background-color: ${(props) => props.theme.buttonBackground};
    color: ${(props) => props.theme.buttonColor};
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 30px;
    @media screen and (max-width: 370px) {
        margin-top: 10px;
        margin-left: auto;
    }
`

const StyledLoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

const StyledButtonContainer = styled.div`
    background-color: rgba(0, 0, 0, 0.6);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
    height: 200px;
`

const StyledButton = styled.button`
    background-color: ${(props) => props.theme.buttonBackground};
    color: ${(props) => props.theme.buttonColor};
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    margin-top: 60px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #555555;
    }
`

const Login: React.FC = () => {
    const { theme, language } = useTypedSelector((state) => state.settings)
    const { changeTheme, changeLanguage } = useActions()

    const { loginUser } = useActions()

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        changeTheme(newTheme)
    }, [theme, changeTheme])

    const toggleLanguage = useCallback(() => {
        const newLanguage = language === 'en' ? 'ru' : 'en'
        changeLanguage(newLanguage)
    }, [language, changeLanguage])

    const locale = useMemo(
        () => (language === 'en' ? englishLocale : russianLocale),
        [language],
    )

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        loginUser(username, password)
    }

    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyle />
            <Header>
                <IconPanda
                    src={SiteIcon}
                    alt="Panda Icon"
                    effect="blur"
                ></IconPanda>
                <Title>{locale.headerTitle}</Title>
                <ThemeButton onClick={toggleTheme}>
                    {theme === 'light' ? 'Dark' : 'Light'} Theme
                </ThemeButton>
                <LanguageButton onClick={toggleLanguage}>
                    {language === 'en' ? 'Русский' : 'English'}
                </LanguageButton>
            </Header>
            <StyledLoginContainer>
                <StyledButtonContainer>
                    <h2>Авторизация</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">Имя пользователя:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Пароль:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <button type="submit">Войти</button>
                    </form>
                </StyledButtonContainer>
            </StyledLoginContainer>
        </ThemeProvider>
    )
}

export default Login
