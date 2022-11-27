import React, { forwardRef, useContext, useState, useEffect } from "react";
import { Button, Card, Checkbox, Grid, Icon, Image, Loader, Popup, Segment } from 'semantic-ui-react';

import { getPlaylist, deletePlaylist, setPlaylistActive } from '../api';
import { updateActivePlaylists } from '../utils/playlists';
import { AppContext } from '../contexts/AppContext';


const  PlaylistSelectionItem = forwardRef(({ playlist, onRemovePlaylist}, ref) => {

    const { 
        activePlaylists
    } = useContext(AppContext);

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [spotifyPlaylist, setSpotifyPlaylist] = useState(null);
    const [checked, setChecked] = useState(activePlaylists.current.includes(parseInt(playlist.id)))
    
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
                setChecked(active);
            },
            (error) => {
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
        if (spotifyPlaylist && spotifyPlaylist.description)
            return <Popup content={ spotifyPlaylist.description } trigger={<Button icon='info' size='mini' />} />
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

    const renderSpotifyPlaylistButtons = () => {
        return (
            <Card.Content extra>
                <Grid relaxed columns={3}>
                    <Grid.Column>
                        { renderDescriptionPopover() } 
                    </Grid.Column>
                    <Grid.Column>
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
                    <Grid.Column>
                        <Checkbox 
                            toggle
                            checked={ checked }
                            onChange={ (event,data) => { onToggleActive( data.checked); } }
                            ref={ ref }
                            getSpotifyPlaylist={ getSpotifyPlaylist }
                        />
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
