import React, { useState } from 'react'
import axios from 'axios'

const VideoUploadForm: React.FC = () => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [status, setStatus] = useState('unlisted') // Значение по умолчанию
	const [video, setVideo] = useState<File | null>(null)

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value)
	}

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setDescription(e.target.value)
	}

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStatus(e.target.value)
	}

	const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setVideo(e.target.files[0])
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!title || !description || !video) {
			console.error('Please fill in all fields')
			return
		}

		const formData = new FormData()
		formData.append('title', title)
		formData.append('description', description)
		formData.append('status', status)
		formData.append('video', video) // Добавляем файл видео в FormData

		try {
			await axios.post('http://127.0.0.1:8000/api/videos/', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			console.log('Video uploaded successfully')
			// Можно добавить здесь обновление состояния или перенаправление после успешной загрузки
		} catch (error) {
			console.error('Error uploading video:', error)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor='title'>Title:</label>
				<input
					type='text'
					id='title'
					value={title}
					onChange={handleTitleChange}
				/>
			</div>
			<div>
				<label htmlFor='description'>Description:</label>
				<textarea
					id='description'
					value={description}
					onChange={handleDescriptionChange}
				/>
			</div>
			<div>
				<label htmlFor='status'>Status:</label>
				<select id='status' value={status} onChange={handleStatusChange}>
					<option value='public'>Public</option>
					<option value='private'>Private</option>
					<option value='unlisted'>Unlisted</option>
				</select>
			</div>
			<div>
				<label htmlFor='video'>Video:</label>
				<input
					type='file'
					id='video'
					accept='video/mkv'
					onChange={handleVideoChange}
				/>
			</div>
			<button type='submit'>Upload</button>
		</form>
	)
}

export default VideoUploadForm
