import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Group from './pages/GroupDetail'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import VideoList from './pages/VideoList'
import Video from './pages/VideoDetail'
import GroupList from './pages/GroupList'
import PlaylistDetail from './pages/PlaylistDetail'
import LoadingBar from './components/LoadingBar' // Импортируем компонент LoadingBar
import { styled } from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const PageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/main" element={<Home />} />
                <Route path="/groups" element={<GroupList />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/videos" element={<VideoList />} />
                <Route path="/video/:id" element={<Video />} />
                <Route path="/group/:id" element={<Group />} />
                <Route path="/playlist/:id" element={<PlaylistDetail />} />
            </Routes>
            {/* <PageWrapper>
                <TransitionGroup>
                    <CSSTransition
                        timeout={200} // You can adjust this timeout value
                        classNames="fade"
                    >
                        <LoadingBar />
                    </CSSTransition>
                </TransitionGroup>
            </PageWrapper> */}
        </Router>
    )
}

export default App
