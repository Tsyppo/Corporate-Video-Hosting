import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import VideoPlayer from './components/VideoPlayer'
import VideoUploadForm from './components/VideoUploadForm'

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<VideoPlayer />} />
				<Route path='/addvideo' element={<VideoUploadForm />} />
			</Routes>
		</Router>
	)
}

export default App
