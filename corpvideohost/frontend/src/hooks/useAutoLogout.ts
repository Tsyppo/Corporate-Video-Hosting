import { useEffect } from 'react'

const useAutoLogout = (timeout: number = 30 * 60 * 1000) => {
    useEffect(() => {
        const logoutTimer = setTimeout(() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }, timeout)

        return () => {
            clearTimeout(logoutTimer)
        }
    }, [timeout])
}

export default useAutoLogout
