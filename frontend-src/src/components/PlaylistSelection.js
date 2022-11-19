import React, { useContext, useState, useEffect } from "react";
import { Button, Icon, Item, Loader } from 'semantic-ui-react';

import { getPlaylists, setActiveAll, setActiveInverse } from '../api';
import { AppContext } from '../contexts/AppContext';
import AddPlaylistModal from './AddPlaylistModal';
import PlaylistSelectionItem from './PlaylistSelectionItem';


function PlaylistSelection() {
    
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { playlists, setPlaylists } = useContext(AppContext);

    const reloadPlaylists = () => {
        getPlaylists()
        .then(
            (result) => {
                setIsLoaded(true);
                setPlaylists(result.data);
            },
            (playlistsError) => {
                setError(playlistsError);
            }
        )
    }

    useEffect(() => {
        reloadPlaylists()
    }, []);

    const setPlaylistsActiveAll = (active) => {
        setActiveAll(active)
        .then(
            () => {
                setIsLoaded(false);
                reloadPlaylists();
            },
            (error) => {
                setError(error);
            }
        )
    }

    const setPlaylistsActiveInverse = () => {
        setActiveInverse()
        .then(
            () => {
                setIsLoaded(false);
                reloadPlaylists();
            },
            (error) => {
                setError(error);
            }
        )
    }

    const onRemovePlaylist = () => {
        setIsLoaded(false);
        reloadPlaylists();
    }

    const onAddPlaylist = () => {
        setIsLoaded(false);
        reloadPlaylists();
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
                        playlist={ playlist }
                        onRemovePlaylist= { onRemovePlaylist }
                    />
                ));
            } else {
                return (
                    <div><Icon name='long arrow alternate up' /> Begin by adding Spotify playlists you would like to modify using the 'plus' button above.</div>
                )
            }
        }
    }

    return (
      <div className='playlist-selection'>
        <Button.Group>
            <AddPlaylistModal onAddPlaylist={ onAddPlaylist } />
            <Button basic color='grey' icon='check square' title='Select All' onClick={ () => { setPlaylistsActiveAll('Y')}} />
            <Button basic color='grey' icon='check square outline' title='Select None' onClick={ () => { setPlaylistsActiveAll('N')}} />
            <Button basic color='grey' icon='exchange' title='Invert Selection' onClick={ setPlaylistsActiveInverse } />
        </Button.Group>
        <Item.Group divided link>{ renderPlaylists() }</Item.Group>
      </div>
    );
  }
  
  export default PlaylistSelection;
  