import React, { forwardRef, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { Button, Card, Checkbox, Grid, Icon, Image, Loader, Popup } from 'semantic-ui-react';


import { addToPlaylist, removeFromPlaylist, getPlaylist, deletePlaylist, setPlaylistActive } from '../api';
import PlaylistFavoriteButton from "./PlaylistFavoriteButton";
import { updateActivePlaylists } from '../utils/playlists';
import { AppContext } from '../contexts/AppContext';


const  PlaylistSelectionItem = forwardRef(({ playlist, onRemovePlaylist }, ref) => {

    const { 
        activePlaylists,
        playingItem
    } = useContext(AppContext);

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [spotifyPlaylist, setSpotifyPlaylist] = useState(null);
    
    useEffect(() => {
        getSpotifyPlaylist();
    }, []);

    const getSpotifyPlaylist = () => {
        setIsLoaded(false);
        getPlaylist(playlist.spotify_playlist_id)
        .then(
            (result) => {
                setIsLoaded(true);
                setSpotifyPlaylist(result.data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    const removePlaylist = () => {
        setIsLoaded(false);
        deletePlaylist(playlist.id)
        .then(
            () => {
                setIsLoaded(true);
                onRemovePlaylist()
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    const onToggleActive = (active) => {
        setPlaylistActive(playlist.id, active ? 'Y' : 'N')
        .then(
            () => {
                activePlaylists.current = updateActivePlaylists(    
                        activePlaylists.current, playlist.id, active);
            },
            (error) => {
                setError(error);
            }
        )
    }

    const addTrackToPlaylist = () => {
        addToPlaylist(playingItem.item.uri, playlist.id)
            .then(
                () => {
                    getSpotifyPlaylist();
                    toast.success('Track added')
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const removeTrackFromPlaylist = () => {
        removeFromPlaylist(playingItem.item.uri, playlist.id)
            .then(
                () => {
                    getSpotifyPlaylist();
                    toast.error('Track removed')
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const renderSpotifyPlaylistDetailsImage = () => {
        if (spotifyPlaylist) {
            return <Image src={ spotifyPlaylist.images[0].url } wrapped ui={false} />
        }
    }

    const renderDescriptionPopover = () => {
        if (spotifyPlaylist)
            return <Popup content={ spotifyPlaylist.description } trigger={<Button icon='info' size='mini' disabled={ spotifyPlaylist.description ? false : true } />} />
    }

    const renderSpotifyPlaylistDetailsContent = () => {
        if (!isLoaded)
            return  <Card.Content><Loader active /></Card.Content>;
        if (spotifyPlaylist) {
            return (
                <Card.Content>
                    <Card.Header as='a' href={spotifyPlaylist.uri} target='_blank'>{ spotifyPlaylist.name }</Card.Header>
                    <Card.Meta>
                        by { spotifyPlaylist.owner.display_name}
                    </Card.Meta>
                    <Card.Description>
                        <Icon name='music' /> { spotifyPlaylist.tracks.total } track(s)
                    </Card.Description>
                </Card.Content>
            )
        }
    }

    const renderFavoriteButton = () => {
        return <PlaylistFavoriteButton spotifyPlaylistId={ playlist.spotify_playlist_id } />
    }

    const renderSpotifyPlaylistButtons = () => {
        return (
            <Card.Content extra>
                <Grid relaxed>
                    <Grid.Column textAlign='center' width={ 3 }>
                        { renderFavoriteButton() } 
                    </Grid.Column>
                    <Grid.Column textAlign='center' width={ 3 }>
                        { renderDescriptionPopover() } 
                    </Grid.Column>
                    <Grid.Column textAlign='center' width={ 3 }>
                        <Button
                            title='Remove this Playlist'
                            icon
                            size='mini'
                            basic
                            color='red'
                            onClick={ removePlaylist }
                        >
                            <Icon name='times circle' />
                        </Button>
                    </Grid.Column>
                    <Grid.Column textAlign='center' width={ 7 }>
                        <Checkbox 
                            toggle
                            checked={ activePlaylists.current.includes(parseInt(playlist.id)) }
                            onChange={ (event,data) => { onToggleActive( data.checked); } }
                            ref={ ref }
                            getSpotifyPlaylist={ getSpotifyPlaylist }
                        />
                    </Grid.Column>
                </Grid>
                <Grid relaxed columns={2}>
                    <Grid.Column textAlign='center'>
                        <Button basic color='green' icon='plus circle' fluid disabled={ playingItem ? false : true } title='Add to Selected Playlists' onClick={ addTrackToPlaylist } />
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <Button basic color='red' icon='times circle' fluid disabled={ playingItem ? false : true } title='Remove from Selected Playlists' onClick={ removeTrackFromPlaylist } />
                    </Grid.Column>
                </Grid>
            </Card.Content>
        )
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else {
        return (
        <Card>
            { renderSpotifyPlaylistDetailsImage() }
            { renderSpotifyPlaylistDetailsContent() }
            { renderSpotifyPlaylistButtons() }
        </Card>
        )
    }
});

export default PlaylistSelectionItem;
