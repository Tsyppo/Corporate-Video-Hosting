import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const PlaylistContainer = styled.div`
    margin-top: 20px;
`

const PlaylistTitle = styled.h3`
    color: ${(props) => props.theme.text};
`

const PlaylistItem = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 10px;
    border: 5px;
    border-radius: 5px;
    margin-right: 100px;
    border: ${(props) => props.theme.border};
    background-color: ${(props) => props.theme.body};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

const Playlists: React.FC<{
    playlists: { name: string; description: string }[]
}> = ({ playlists }) => {
    return (
        <PlaylistContainer>
            <PlaylistTitle>Плейлисты:</PlaylistTitle>
            {playlists.map((playlist, index) => (
                <PlaylistItem key={index}>
                    <PlaylistIcon>Icon</PlaylistIcon>{' '}
                    {/* замените на иконку плейлиста */}
                    <Link key={index} to={`/playlist`}>
                        <PlaylistInfo>
                            <PlaylistName>{playlist.name}</PlaylistName>

                            <PlaylistDescription>
                                {playlist.description}
                            </PlaylistDescription>
                        </PlaylistInfo>
                    </Link>
                </PlaylistItem>
            ))}
        </PlaylistContainer>
    )
}

export default Playlists
