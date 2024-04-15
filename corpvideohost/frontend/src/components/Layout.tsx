import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import SiteIcon from '../assets/images/Panda.svg'
import HomeIcon from '../assets/images/home.svg'
import GroupIcon from '../assets/images/group.svg'
import FavoriteIcon from '../assets/images/favorite.svg'
import BackgroundPng from '../assets/images/background.png'
import { useSidebarToggle } from '../hooks/useWindowWidth'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { lightTheme, darkTheme } from '../theme/theme'
import { englishLocale, russianLocale } from '../theme/locales'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { MdMenu } from 'react-icons/md'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Sans-serif, sans-serif;
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
    background-position: 120px 90px;
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

const Icon = styled(LazyLoadImage)`
    width: 50px;
    margin-right: 10px;
`

const Title = styled.h1`
    margin: 0;
    @media screen and (max-width: 1920px) {
        font-size: 36px;
    }
`

const Sidebar = styled.nav`
    width: 120px;
    background-color: ${(props) => props.theme.headerBackground};
    transition: background-color 0.3s ease;
    position: fixed;
    top: 0;
    bottom: 0;
    margin-top: 70px;
    z-index: 100;
    @media screen and (max-width: 610px) {
        display: none;
        margin-top: 170px;
    }
`

const Navigation = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 10px;
    padding-left: 12px;
`

const NavLink = styled(Link)`
    text-decoration: none;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    color: ${(props) => props.theme.headerText};
    padding: 10px;
    transition: background-color 0.3s ease;
    width: 80px;

    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
`

const Label = styled.p`
    margin-top: 0;
    margin-left: -8px;
    font-size: 16px;
`
const LabelUser = styled.p`
    font-size: 16px;
`

const Content = styled.main`
    margin-top: 60px;
    margin-left: 200px;
    padding: 20px;
    @media screen and (max-width: 610px) {
        margin-left: 0px;
        margin-top: 150px;
    }
`

const SearchInput = styled.input`
    flex: 1;
    padding: 8px;
    border-radius: 4px;
    font-size: 16px;
    border: ${(props) => props.theme.border};
    background-color: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
    transition: 0.3s ease;
    margin: auto;
    max-width: 700px;
    width: 60%;
    @media screen and (max-width: 1150px) {
        width: 95%;
        margin-left: 20px;
    }
    @media screen and (max-width: 768px) {
        width: 90%;
        margin-left: 20px;
    }
    @media screen and (max-width: 610px) {
        width: 95%;
        margin-left: 20px;
        flex: 0 80%;
        margin-right: 10px;
        margin-top: 10px;
    }
`

const MenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    color: ${(props) => props.theme.headerText};
    font-size: 24px;
    cursor: pointer;
    margin: 0 auto 0 50px;
    @media screen and (max-width: 610px) {
        margin-top: 15px;
        display: block;
    }
`

const ThemeButton = styled.button`
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.buttonColor};
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
    @media screen and (max-width: 610px) {
        margin-top: 10px;
        margin-right: 20px;
        background-color: ${(props) => props.theme.buttonBackground};
    }
`

const LanguageButton = styled.button`
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.buttonColor};
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
    @media screen and (max-width: 610px) {
        margin-top: 10px;
        margin-right: 20px;
    }
`

const DropdownButton = styled.button`
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.buttonColor};
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 30px;
    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
    @media screen and (max-width: 610px) {
        margin-top: 10px;
    }
`

const DropdownMenu = styled.ul<{ isOpen: boolean }>`
    margin-right: 40px;
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 10px;
    padding: 0;
    list-style: none;
    background-color: #333;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 5px;
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
`
const DropdownItem = styled.li`
    padding: 10px;
    cursor: pointer;

    &:hover {
        background-color: #444;
    }
`
interface LayoutProps {
    children: ReactNode
}

const Layout: React.FC<LayoutProps> = React.memo(({ children }) => {
    const { setSearchTerm, changeTheme, changeLanguage } = useActions()
    const { theme, language } = useTypedSelector((state) => state.settings)
    const navigate = useNavigate()
    const [searchTerm, setSearchTermLocal] = useState('')
    const [showSidebar, toggleSidebar] = useSidebarToggle()

    const { logoutUser } = useActions()
    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target
            setSearchTerm(value)
            setSearchTermLocal(value)
        },
        [setSearchTerm],
    )

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

    const handleLogout = () => {
        logoutUser()
    }

    const user = localStorage.getItem('user')
    let userObjectFromStorage: any | null = null
    let username: any | null = null
    let role: any | null = null
    if (user !== null) {
        userObjectFromStorage = JSON.parse(user)
        console.log(userObjectFromStorage)
        username = userObjectFromStorage.username
        role = userObjectFromStorage.role
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }

    const [isOpen, setIsOpen] = useState(false)

    const handleButtonProfileClick = () => {
        navigate('/profile')
    }

    const handleButtonVideosClick = () => {
        navigate('/videos')
    }

    return (
        <ThemeProvider theme={theme === 'dark' ? lightTheme : darkTheme}>
            <>
                <GlobalStyle />
                <Header>
                    <IconPanda
                        src={SiteIcon}
                        alt="Panda Icon"
                        effect="blur"
                    ></IconPanda>
                    <Title>{locale.headerTitle}</Title>
                    <SearchInput
                        type="text"
                        placeholder={locale.searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <MenuButton onClick={toggleSidebar}>
                        <MdMenu />
                    </MenuButton>
                    <ThemeButton onClick={toggleTheme}>
                        {theme === 'light' ? 'Light' : 'Dark'} Theme
                    </ThemeButton>
                    <LanguageButton onClick={toggleLanguage}>
                        {language === 'en' ? 'Русский' : 'English'}
                    </LanguageButton>
                    <DropdownMenu isOpen={isOpen}>
                        <DropdownItem onClick={handleButtonProfileClick}>
                            Мой профиль
                        </DropdownItem>
                        {role === 'admin' || role === 'manager' ? (
                            <DropdownItem onClick={handleButtonVideosClick}>
                                Мои видео
                            </DropdownItem>
                        ) : null}
                        <DropdownItem onClick={handleLogout}>
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                    <DropdownButton onClick={() => setIsOpen(!isOpen)}>
                        <LabelUser>{username}</LabelUser>
                    </DropdownButton>
                </Header>
                <Sidebar style={{ display: showSidebar ? 'block' : 'none' }}>
                    <Navigation>
                        <NavLink to="/main">
                            <Icon
                                src={HomeIcon}
                                alt="Panda Icon"
                                effect="blur"
                            ></Icon>
                            <Label>{locale.mainNavHome}</Label>
                        </NavLink>
                        <NavLink to="/favorites">
                            <Icon
                                src={FavoriteIcon}
                                alt="Panda Icon"
                                effect="blur"
                            ></Icon>
                            <Label>{locale.mainNavFavorites}</Label>
                        </NavLink>
                        <NavLink to="/groups">
                            {' '}
                            <Icon
                                src={GroupIcon}
                                alt="Panda Icon"
                                effect="blur"
                            ></Icon>
                            <Label>{locale.mainNavGroup}</Label>
                        </NavLink>
                    </Navigation>
                </Sidebar>
                <Content>{children}</Content>
            </>
        </ThemeProvider>
    )
})

export default Layout
