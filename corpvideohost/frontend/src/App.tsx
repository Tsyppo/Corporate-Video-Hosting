import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import VideoPlayer from './components/VideoPlayer'
import VideoUploadForm from './components/VideoUploadForm'
import Home from './pages/Home'
import Login from './pages/Login'
import TokenChecker from './components/TokenChecker'

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/main" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/addvideo" element={<VideoUploadForm />} />
            </Routes>
        </Router>
    )
}

export default App
