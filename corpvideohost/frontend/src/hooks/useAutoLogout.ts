import { useEffect, useState } from 'react'

const useAutoLogout = (timeout: number, logoutCallback: () => void) => {
    const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const resetTimer = () => {
            if (logoutTimer) {
                clearTimeout(logoutTimer)
            }
            setLogoutTimer(setTimeout(logoutCallback, timeout))
        }

        const handleUserActivity = () => {
            resetTimer()
        }

        document.addEventListener('keydown', handleUserActivity)
        document.addEventListener('mousemove', handleUserActivity)

        resetTimer()

        return () => {
            if (logoutTimer) {
                clearTimeout(logoutTimer)
            }
            document.removeEventListener('keydown', handleUserActivity)
            document.removeEventListener('mousemove', handleUserActivity)
        }
    }, [timeout, logoutCallback, logoutTimer])

    return null
}

export default useAutoLogout
