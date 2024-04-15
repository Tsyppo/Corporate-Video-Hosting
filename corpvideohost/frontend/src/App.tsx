import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Group from './pages/Group'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import VideoList from './pages/VideoList'
import Video from './pages/Video'
import GroupList from './pages/GroupList'
import PlaylistDetail from './pages/PlaylistDetail'

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
                <Route path="/playlist" element={<PlaylistDetail />} />
            </Routes>
        </Router>
    )
}

export default App
