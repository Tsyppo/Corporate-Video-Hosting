import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Group from './pages/GroupDetail'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import VideoList from './pages/VideoList'
import Video from './pages/VideoDetail'
import GroupList from './pages/GroupList'
import PlaylistDetail from './pages/PlaylistDetail'
import VideoPlayerComponent from './components/VideoPlayer'

const App: React.FC = () => {
    const videoFolder = 'https://storage.yandexcloud.net/videohostvideos/sample'

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
        </Router>
    )
}

export default App
