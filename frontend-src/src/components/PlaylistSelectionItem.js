import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Button, Checkbox, Icon, Item, Label, Loader, Segment } from 'semantic-ui-react';

function PlaylistSelectionItem(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [playlist, setPlaylist] = useState(null);
    const [checked, setChecked] = useState(props.active == 'Y' ? true : false);
    

    useEffect(() => {
        fetchPlaylist();
    }, []);

    const fetchPlaylist = () => {
        setIsLoaded(false);
        axios.get(`/api/v1/playlists/${props.spotifyPlaylistId}`)
        .then(
            (result) => {
                setIsLoaded(true);
                setPlaylist(result.data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    const removePlaylist = () => {
        setIsLoaded(false);
        axios.delete(`/api/app/playlist/${props.id}`)
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
        axios.patch(`/api/app/playlist/${props.id}/active`, {
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
        if (playlist) {
            return (
                <Item key={ playlist.id }>
                    <Item.Image size='tiny' src={ playlist.images[0].url } />
                    <Item.Content>
                        <Item.Header as='a' href={playlist.external_urls.spotify} target='_blank'>{ playlist.name }</Item.Header>
                        <Item.Description>{ playlist.description }</Item.Description>
                        <Item.Meta>
                            by { playlist.owner.display_name}
                        </Item.Meta>
                        <Item.Extra>
                            <Label><Icon name='music' />{ playlist.tracks.total } track(s)</Label>
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
