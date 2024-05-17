import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { User } from '../types/user'
import { Video as VideoType } from '../types/video'

const Button = styled.button`
    height: 40px;
    font-size: medium;
    margin-left: auto;
    margin-right: 450px;
    margin-top: 20px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`

const ButtonPanel = styled.button`
    height: 40px;
    font-size: medium;
    margin-top: 20px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`

const ButtonClosePanel = styled(ButtonPanel)`
    position: absolute;
    bottom: 30px;
    right: 30px;
`
const ContainerPanel = styled.div`
    display: flex;
`

const PanelContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 650px;
    padding: 20px;
    border-radius: 10px;

    background-color: rgba(53, 53, 53, 0.9);
    backdrop-filter: blur(50px);
    z-index: 10000;
`

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    pointer-events: none;
`

const OverlayContent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
`

const MainTitle = styled.h1`
    color: ${(props) => props.theme.text};
    text-align: center;
`

const Table = styled.table`
    width: 800px;
    border-collapse: collapse;
    color: ${(props) => props.theme.text};
`

const TableHead = styled.thead`
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
`

const TableBody = styled.tbody`
    background-color: ${(props) => props.theme.bodyBackground};
    color: ${(props) => props.theme.bodyText};
`

const TableRow = styled.tr<{ status?: string }>`
    background-color: ${(props) =>
        props.status === 'Просмотрено' ? '#5e5e5e' : '#3b3b3b'};
`

const TableCell = styled.td`
    padding: 10px;
    border: 1px solid black;
    text-align: center;
`

const TableHeaderCell = styled.th`
    background-color: ${(props) => props.theme.headerBackground};
    padding: 10px;
    border: 1px solid black;
`

const TableContainer = styled.div`
    max-height: 500px; /* Максимальная высота контейнера */
    overflow: auto; /* Добавляем прокрутку, только если содержимое выходит за пределы */
    position: relative; /* Для позиционирования псевдоэлемента */
    scrollbar-width: thin;
    scrollbar-color: black;
    scroll-padding-top: var(--header-height);
    scroll-behavior: smooth;
`

const FixedTableHead = styled(TableHead)`
    position: sticky;
    top: 0;
    z-index: 1;
`

const PanelAnalytics: React.FC<{
    isPanelOpen: boolean
    togglePanel: () => void
    id?: number
}> = ({ isPanelOpen, togglePanel, id }) => {
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    const users = useTypedSelector((state) => state.user.users)
    const { fetchListUser, fetchAnalytics } = useActions()
    const analytics = useTypedSelector((state) => state.analytics.analytics)
    const videos = useTypedSelector((state) => state.video.videos)

    useEffect(() => {
        fetchListUser()
        fetchAnalytics()
    }, [])

    if (!videos) {
        return <div>Video loading...</div>
    }

    const video: VideoType | undefined = videos?.find(
        (video) => video.id === id,
    )

    if (!video) {
        return <div>Video not found</div>
    }

    const targetAnalytics = analytics!?.find(
        (entry) => entry.user === userId && entry.video === video.id,
    )

    const filterAnalytics = analytics!?.filter(
        (entry) => entry.video === video.id,
    )
    targetAnalytics?.view_date

    const formatDate = (viewDate: string): string => {
        let formattedDate = ''
        if (viewDate) {
            const date = new Date(viewDate)
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }
            formattedDate = date.toLocaleString('ru-RU', options)
        }
        return formattedDate
    }

    targetAnalytics?.duration
    targetAnalytics?.full_duration

    const formatTime = (durationString: string): string => {
        const durationInSeconds = parseInt(durationString)

        const hours = Math.floor(durationInSeconds / 3600)
        const minutes = Math.floor((durationInSeconds % 3600) / 60)
        const seconds = durationInSeconds % 60

        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

        return formattedTime
    }

    const calculateCompletionPercentage = (
        duration: string,
        fullDuration: string,
    ): number => {
        const durationInSeconds = parseInt(duration || '0')
        const fullDurationInSeconds = parseInt(fullDuration || '0')

        // Если общая продолжительность видео равна 0, возвращаем 0
        if (fullDurationInSeconds === 0) return 0

        // Рассчитываем процент завершенности
        const percentage = (durationInSeconds / fullDurationInSeconds) * 100

        // Округляем процент до целого числа
        return Math.round(percentage)
    }

    const timeInView = formatTime(targetAnalytics?.duration || '0')
    const totalDuration = formatTime(targetAnalytics?.full_duration || '0')

    let loggedInUser: User | null = null

    if (userId && users) {
        const foundUser = users.find((user) => user.id === userId)
        loggedInUser = foundUser !== undefined ? foundUser : null
    }

    const getUserName = (userId: number) => {
        // Ищем пользователя с указанным ID в списке пользователей
        const creator = users?.find((user) => user.id === userId)
        if (creator) {
            return creator.username // Возвращаем имя пользователя, если найден
        }
        return 'Неизвестный пользователь'
    }

    if (!isPanelOpen) return null

    return ReactDOM.createPortal(
        <>
            <Overlay>
                <OverlayContent onClick={togglePanel} />{' '}
            </Overlay>
            <PanelContainer>
                <MainTitle>Аналитика видео</MainTitle>
                <ContainerPanel>
                    <TableContainer>
                        <Table>
                            <FixedTableHead>
                                <TableRow>
                                    <TableHeaderCell>Имя</TableHeaderCell>
                                    <TableHeaderCell>
                                        Дата начала просмотра
                                    </TableHeaderCell>
                                    <TableHeaderCell>
                                        Время просмотра
                                    </TableHeaderCell>
                                    <TableHeaderCell>
                                        Процент просмотра
                                    </TableHeaderCell>
                                    <TableHeaderCell>Статус</TableHeaderCell>
                                </TableRow>
                            </FixedTableHead>
                            <TableBody>
                                {filterAnalytics
                                    ?.sort((a, b) => {
                                        const userNameA = getUserName(
                                            a.user,
                                        ).toLowerCase()
                                        const userNameB = getUserName(
                                            b.user,
                                        ).toLowerCase()
                                        return userNameA.localeCompare(
                                            userNameB,
                                        )
                                    })
                                    .map((analytic) => (
                                        <TableRow
                                            status={analytic.status}
                                            key={analytic.id}
                                        >
                                            <TableCell>
                                                {getUserName(analytic.user)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(analytic.view_date)}
                                            </TableCell>
                                            <TableCell>
                                                {formatTime(
                                                    analytic?.duration || '0',
                                                )}{' '}
                                                /{' '}
                                                {formatTime(
                                                    analytic?.full_duration ||
                                                        '0',
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {calculateCompletionPercentage(
                                                    analytic?.duration,
                                                    analytic?.full_duration,
                                                )}
                                                %
                                            </TableCell>
                                            <TableCell>
                                                {analytic.status}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ContainerPanel>
                <ButtonClosePanel onClick={togglePanel}>
                    Закрыть панель
                </ButtonClosePanel>
            </PanelContainer>
        </>,
        document.body,
    )
}

export default PanelAnalytics
