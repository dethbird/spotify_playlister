import React, { useContext, useEffect } from "react";
import { Button, Icon, Item, Loader } from 'semantic-ui-react';

import { getPlaylists, setActiveAll, setActiveInverse } from '../api';
import { AppContext } from '../contexts/AppContext';
import AddPlaylistModal from './AddPlaylistModal';
import PlaylistSelectionItem from './PlaylistSelectionItem';
import { extractActivePlaylistIds } from '../utils/playlists'


function PlaylistSelection() {
    
    const { 
        playlists,
        setPlaylists,
        playlistsError,
        setPlaylistsError,
        playlistsLoaded,
        setPlaylistsLoaded,
        activePlaylists
    } = useContext(AppContext);

    const reloadPlaylists = () => {
        getPlaylists()
        .then(
            (result) => {
                setPlaylistsLoaded(true);
                setPlaylists(result.data);
                activePlaylists.current = (extractActivePlaylistIds(result.data))
            },
            (playlistsError) => {
                setPlaylistsError(playlistsError);
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
                setPlaylistsLoaded(false);
                reloadPlaylists();
            },
            (playlistsError) => {
                setPlaylistsError(playlistsError);
            }
        )
    }

    const setPlaylistsActiveInverse = () => {
        setActiveInverse()
        .then(
            () => {
                setPlaylistsLoaded(false);
                reloadPlaylists();
            },
            (playlistsError) => {
                setPlaylistsError(playlistsError);
            }
        )
    }

    const onRemovePlaylist = () => {
        setPlaylistsLoaded(false);
        reloadPlaylists();
    }

    const onAddPlaylist = () => {
        setPlaylistsLoaded(false);
        reloadPlaylists();
    }

    const renderPlaylists = () => {
        if (playlistsError) {
            return <div>Error: {playlistsError.message}</div>;
        } else if (!playlistsLoaded) {
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
  