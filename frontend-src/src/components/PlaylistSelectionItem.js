import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Button, Checkbox, Icon, Item, Label, Loader, Segment } from 'semantic-ui-react';

function PlaylistSelectionItem(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [spotifyPlaylist, setSpotifyPlaylist] = useState(null);
    const [checked, setChecked] = useState(props.playlist.active == 'Y' ? true : false);
    

    useEffect(() => {
        fetchPlaylist();
    }, []);

    const fetchPlaylist = () => {
        setIsLoaded(false);
        axios.get(`/api/v1/playlists/${props.playlist.spotify_playlist_id}`)
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
        axios.delete(`/api/app/playlist/${props.playlist.id}`)
        .then(
            () => {
                setIsLoaded(true);
                props.onRemovePlaylist()
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    const onToggleActive = (active) => {
        axios.patch(`/api/app/playlist/${props.playlist.id}/active`, {
            'active' : active ? 'Y' : 'N'
        })
        .then(
            () => {
                setChecked(active);
            },
            (error) => {
                setError(error);
            }
        )
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <Loader active />;
    } else {
        if (spotifyPlaylist) {
            return (
                <Item key={ spotifyPlaylist.id }>
                    <Item.Image size='tiny' src={ spotifyPlaylist.images[0].url } />
                    <Item.Content>
                        <Item.Header as='a' href={spotifyPlaylist.external_urls.spotify} target='_blank'>{ spotifyPlaylist.name }</Item.Header>
                        <Item.Description>{ spotifyPlaylist.description }</Item.Description>
                        <Item.Meta>
                            by { spotifyPlaylist.owner.display_name}
                        </Item.Meta>
                        <Item.Extra>
                            <Label><Icon name='music' />{ spotifyPlaylist.tracks.total } track(s)</Label>
                        </Item.Extra>
                    </Item.Content>
                    <Segment basic floated='right' textAlign='right'>
                        <Checkbox 
                            toggle
                            checked={ checked }
                            onChange={ (event,data) => { onToggleActive(data.checked); } }
                        />
                        <br />
                        <Button
                            title='Remove this Playlist'
                            icon
                            size='small'
                            basic
                            color='red'
                            onClick={ removePlaylist }
                        ><Icon name='times circle' /></Button>
                    </Segment>
                </Item>
            )
        }
    }

}

export default PlaylistSelectionItem;
