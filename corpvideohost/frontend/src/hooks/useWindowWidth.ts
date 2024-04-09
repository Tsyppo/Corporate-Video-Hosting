import { useState, useEffect, useCallback } from 'react'

export function useSidebarToggle() {
    const [showSidebar, setShowSidebar] = useState(true)
    const windowWidth = useWindowWidth()
    useEffect(() => {
        setShowSidebar(windowWidth > 610)
    }, [windowWidth])

    const toggleSidebar = useCallback(() => {
        setShowSidebar((prevState) => !prevState)
    }, [])

    return [showSidebar, toggleSidebar] as const
}

export function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const handleResize = useCallback(() => {
        setWindowWidth(window.innerWidth)
    }, [])

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [handleResize])

    return windowWidth
}
