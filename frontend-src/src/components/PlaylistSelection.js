import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Button, Item, Loader } from 'semantic-ui-react';
import AddPlaylistModal from './AddPlaylistModal';
import PlaylistSelectionItem from './PlaylistSelectionItem';


function PlaylistSelection() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = () => {
        axios.get('/api/app/playlists')
        .then(
            (result) => {
                setIsLoaded(true);
                setPlaylists(result.data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    const onRemovePlaylist = () => {
        fetchPlaylists();
    }

    const onAddPlaylist = () => {
        fetchPlaylists();
    }
    

    const renderPlaylists = () => {
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <Loader active />;
        } else {
            if (playlists.length) {
                return playlists.map(playlist => (
                    <PlaylistSelectionItem 
                        spotifyPlaylistId={ playlist.spotify_playlist_id }
                        id={ playlist.id }
                        onRemovePlaylist= { onRemovePlaylist }
                    />
                ));
            }
        }
    }

    return (
      <div className='playlist-selection'>
        <Button.Group>
            <AddPlaylistModal onAddPlaylist={ onAddPlaylist } />
            <Button basic color='grey' icon='check square' title='Select All' />
            <Button basic color='grey' icon='check square outline' title='Select None' />
            <Button basic color='grey' icon='exchange' title='Invert Selection' />
        </Button.Group>
        <Item.Group divided link>{ renderPlaylists() }</Item.Group>
      </div>
    );
  }
  
  export default PlaylistSelection;
  