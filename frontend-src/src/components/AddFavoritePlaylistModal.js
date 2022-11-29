import React, { useState } from "react";
import { Button, Divider, Icon, Label, Loader, Modal, Item } from 'semantic-ui-react';

import { favorites, addPlaylist } from '../api';

function AddFavoritePlaylistModal(props) {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [favoritePlaylists, setFavoritePlaylists] = useState(null);

    const getFavoritedPlaylists = (offset = 0) => {
          favorites()
          .then(
            (result) => {
                setIsLoaded(true);
                setFavoritePlaylists(result.data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
          )
    }

    const onSelectPlaylist = (playlistId) => {
        setIsLoaded(false);
        addPlaylist(playlistId)
        .then(
            (result) => {
                setIsLoaded(true);
                setOpen(false);
                props.onAddPlaylist();
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
                setOpen(false);
            }
        )
    }

    const renderPlaylists = () => {
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <Loader active />;
        } else {
            if (favoritePlaylists.len === 0)
                return <Item>No playlists favorited yet.</Item>

            return favoritePlaylists.map(playlist => (
                <Item key={ playlist.spotify_playlist.id }>
                    <Item.Image size='tiny' src={ playlist.spotify_playlist.images[0].url } />
                    <Item.Content>
                        <Item.Header as='a' href={playlist.spotify_playlist.external_urls.spotify} target='_blank'>{ playlist.spotify_playlist.name }</Item.Header>
                        <Item.Description>{ playlist.spotify_playlist.description }</Item.Description>
                        <Item.Meta>
                            by { playlist.spotify_playlist.owner.display_name}
                        </Item.Meta>
                        <Item.Extra>
                            <Label><Icon name='music' />{ playlist.spotify_playlist.tracks.total } track(s)</Label>
                            <Button 
                                color='green'
                                floated='right'
                                onClick={() => { onSelectPlaylist(playlist.spotify_playlist.id) }}
                            >
                                Select <Icon name='chevron right' />
                            </Button>
                        </Item.Extra>
                    </Item.Content>
                </Item>
            ));
        }
    }


    return (
        <Modal
            closeIcon
            centered={false}
            onClose={() => setOpen(false)}
            onOpen={() => {
                    setOpen(true);
                    getFavoritedPlaylists();
                }
            }
            open={open}
            trigger={<Button basic color='grey' icon='star' title='Favorited Playlists' />}
        >
            <Modal.Header>Select a Favorited Playlist</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Item.Group divided link>{ renderPlaylists() }</Item.Group>
                </Modal.Description>
                <Divider />
            </Modal.Content>
            <Modal.Actions>
                <Button color='blue' onClick={() => setOpen(false)}>
                    Done
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default AddFavoritePlaylistModal;
