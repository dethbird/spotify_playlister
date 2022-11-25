import React, { useContext, useEffect, useRef } from "react";
import { Button, Icon, Item, Loader } from 'semantic-ui-react';

import { getPlaylists, setActiveAll, setActiveInverse } from '../api';
import { AppContext } from '../contexts/AppContext';
import AddPlaylistModal from './AddPlaylistModal';
import PlaylistSelectionItem from './PlaylistSelectionItem';
import { 
    extractActivePlaylistIds,
    setActivePlaylistsAll,
    setActivePlaylistsInverse,
    updatePlaylistsSetCurrentlyActive,
    updatePlaylistsCheckedUI 
} from '../utils/playlists';


function PlaylistSelection() {
    
    const { 
        playlists,
        setPlaylists,
        playlistsError,
        setPlaylistsError,
        playlistsLoaded,
        setPlaylistsLoaded,
        activePlaylists,
        playlistRefs
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
                activePlaylists.current = setActivePlaylistsAll(
                    playlists, active === 'Y' ? true : false);
                    setPlaylists(
                        updatePlaylistsSetCurrentlyActive(playlists, activePlaylists.current));
                    updatePlaylistsCheckedUI(playlistRefs.current, playlists);
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
                activePlaylists.current = setActivePlaylistsInverse(
                    playlists, activePlaylists.current);
                setPlaylists(
                    updatePlaylistsSetCurrentlyActive(playlists, activePlaylists.current));
                updatePlaylistsCheckedUI(playlistRefs.current, playlists);
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
        } else if (playlistsLoaded === false) {
            return <Loader active />;
        } else {
            if (playlists.length) {
                return playlists.map((playlist, index) => (
                    <PlaylistSelectionItem 
                        playlist={ playlist }
                        onRemovePlaylist= { onRemovePlaylist }
                        ref={(element) => {
                            playlistRefs.current[parseInt(playlist.id)] = element;
                        }}
                        key={index}
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
  