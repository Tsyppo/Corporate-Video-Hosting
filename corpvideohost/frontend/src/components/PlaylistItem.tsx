import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Playlist } from '../types/playlist'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { fetchPlaylistList } from '../store/actions/playlistActions'
import { useActions } from '../hooks/useAction'

const PlaylistContainer = styled.div`
    margin-top: 20px;
    width: 800px;
`

const PlaylistTitle = styled.h3`
    font-size: 24px;
    color: ${(props) => props.theme.text};
`

const Button = styled.button`
    height: 40px;
    font-size: medium;
    margin-left: auto;
    margin-right: 50px;
    background-color: ${(props) => props.theme.headerBackground};
    color: ${(props) => props.theme.headerText};
    transition: background-color 0.3s ease;
    padding: 0 20px;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.buttonBackground};
    }
`

const PlaylistObject = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 10px;
    border-radius: 50px;
    background-color: ${(props) => props.theme.playlistobject};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
    }
`

const PlaylistIcon = styled.div`
    width: 50px;
    height: 50px;
    color: ${(props) => props.theme.text};
    background-color: ${(props) => props.theme.headerBackground};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
`

const PlaylistInfo = styled.div`
    flex: 1;
`

const PlaylistName = styled.h4`
    margin: 0;
    color: ${(props) => props.theme.text};
`

const PlaylistDescription = styled.p`
    margin: 5px 0 0;
    color: ${(props) => props.theme.text};
`

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
`
interface PlaylistItemProps {
    groupId: number
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ groupId }) => {
    const dispatch = useDispatch()
    const { playlists } = useTypedSelector((state) => state.playlist)
    const users = useTypedSelector((state) => state.user.users)
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? parseInt(userIdString) : null
    const { fetchListUser, fetchVideoList, fetchPlaylistList, deletePlaylist } =
        useActions()

    useEffect(() => {
        fetchVideoList()
        fetchListUser()
        fetchPlaylistList()
    }, [])

    let loggedInUser = null
    if (userId && users) {
        loggedInUser = users.find((user) => user.id === userId)
    }

    let role = loggedInUser?.role

    const filteredPlaylists = playlists
        ? playlists.filter((playlist: Playlist) => playlist.group === groupId)
        : null

    const handleDeletePlaylist = async (playlistId: number) => {
        deletePlaylist(playlistId)
    }

    return (
        <PlaylistContainer>
            <PlaylistTitle>Плейлисты:</PlaylistTitle>
            {filteredPlaylists ? (
                filteredPlaylists.map((playlist: Playlist) => (
                    <PlaylistObject>
                        <StyledLink
                            to={`/playlist/${playlist.id}`}
                            key={playlist.id}
                        >
                            <PlaylistIcon>Icon</PlaylistIcon>
                            <PlaylistInfo>
                                <PlaylistName>{playlist.title}</PlaylistName>
                                <PlaylistDescription>
                                    {playlist.status}
                                </PlaylistDescription>
                            </PlaylistInfo>
                        </StyledLink>
                        {role === 'manager' || role === 'admin' ? (
                            <Button
                                onClick={() =>
                                    handleDeletePlaylist(playlist.id)
                                }
                            >
                                Удалить
                            </Button>
                        ) : null}
                    </PlaylistObject>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </PlaylistContainer>
    )
}

export default PlaylistItem
