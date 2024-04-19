import React, { useCallback, useMemo, useState } from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import BackgroundPng from '../assets/images/background.png'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { lightTheme, darkTheme } from '../theme/theme'

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
    background-position: 0 90px;
    z-index: -1;
    opacity: 0.1;
    @media screen and (max-width: 610px) {
        background-position: 0 90px;
    }
  }
`
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

const Form = styled.form`
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 250px;
    padding: 20px;
    border: 1px solid #000000;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
`

const Label = styled.h1`
    color: #fff;
`

const FormGroup = styled.div`
    margin-bottom: 20px;
`

const Input = styled.input`
    width: 100%;
    text-align: center;
    background: transparent;
    border: none;
    border-bottom: 1px solid #fff;
    font-family: 'PLay', sans-serif;
    font-size: 16px;
    font-weight: 200px;
    padding: 10px 0;
    transition: border 0.5s;
    outline: none;
    color: #fff;
    font-weight: bold;
`

const Button = styled.button`
    width: 80%;
    height: 40px;
    margin-top: 20px;
    padding: 10px;
    background-color: #363636;
    color: #fff;
    border: 1px solid #000000;
    border-radius: 100px;
    cursor: pointer;

    &:hover {
        background-color: #000000;
    }
`

const Login: React.FC = () => {
    const { theme } = useTypedSelector((state) => state.settings)

    const { loginUser } = useActions()

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
        <ThemeProvider theme={theme === 'dark' ? lightTheme : darkTheme}>
            <GlobalStyle />
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Label>Login</Label>
                    <FormGroup>
                        <Input
                            type="text"
                            id="username"
                            value={username}
                            placeholder="Usernsme"
                            onChange={handleUsernameChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            placeholder="Password"
                            onChange={handlePasswordChange}
                        />
                    </FormGroup>
                    <Button type="submit">Войти</Button>
                </Form>
            </Container>
        </ThemeProvider>
    )
}

export default Login
