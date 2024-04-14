import React, { useState } from 'react'
import { useActions } from '../hooks/useAction'
import { useTypedSelector } from '../hooks/useTypedSelector'
import TokenChecker from './TokenChecker'
import { useSelector } from 'react-redux'
import { RootState } from '../store/reducers'

const VideoUploadForm: React.FC = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('unlisted')
    const [video, setVideo] = useState<File | null>(null)
    const { uploadVideo } = useActions()
    const user = localStorage.getItem('user')
    let userObjectFromStorage: any | null = null

    if (user !== null) {
        userObjectFromStorage = JSON.parse(user)
        console.log(userObjectFromStorage)
    } else {
        console.log('Объект пользователя отсутствует в localStorage')
    }
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
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
        formData.append('video', video)
        if (user) {
            formData.append('creator', userObjectFromStorage.id)
        }

        uploadVideo(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <TokenChecker targetRoute="/addvideo"></TokenChecker>
            <div>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </div>
            <div>
                <label htmlFor="status">Status:</label>
                <select
                    id="status"
                    value={status}
                    onChange={handleStatusChange}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                </select>
            </div>
            <div>
                <label htmlFor="video">Video:</label>
                <input
                    type="file"
                    id="video"
                    accept="video/mkv"
                    onChange={handleVideoChange}
                />
            </div>
            <button type="submit">Upload</button>
        </form>
    )
}

export default VideoUploadForm
function getState() {
    throw new Error('Function not implemented.')
}
