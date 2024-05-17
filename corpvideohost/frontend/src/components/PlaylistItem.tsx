import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Playlist } from '../types/playlist'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { fetchPlaylistList } from '../store/actions/playlistActions'

const PlaylistContainer = styled.div`
    margin-top: 20px;
    width: 800px;
`

const PlaylistTitle = styled.h3`
    font-size: 24px;
    color: ${(props) => props.theme.text};
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
    text-decoration: none;
`
interface PlaylistItemProps {
    groupId: number
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ groupId }) => {
    const dispatch = useDispatch()
    const { playlists } = useTypedSelector((state) => state.playlist)
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchPlaylistList()(dispatch)
            } catch (error) {
                console.error('Error fetching group list:', error)
            }
        }

        fetchData()
    }, [dispatch])

    const filteredPlaylists = playlists
        ? playlists.filter((playlist: Playlist) => playlist.group === groupId)
        : null

    return (
        <PlaylistContainer>
            <PlaylistTitle>Плейлисты:</PlaylistTitle>
            {filteredPlaylists ? (
                filteredPlaylists.map((playlist: Playlist) => (
                    <StyledLink
                        to={`/playlist/${playlist.id}`}
                        key={playlist.id}
                    >
                        <PlaylistObject>
                            <PlaylistIcon>Icon</PlaylistIcon>
                            <PlaylistInfo>
                                <PlaylistName>{playlist.title}</PlaylistName>
                                <PlaylistDescription>
                                    {playlist.status}
                                </PlaylistDescription>
                            </PlaylistInfo>
                        </PlaylistObject>
                    </StyledLink>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </PlaylistContainer>
    )
}

export default PlaylistItem
