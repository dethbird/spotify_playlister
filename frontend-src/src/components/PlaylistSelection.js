import React, { useContext, useEffect, useRef } from "react";
import { Button, Grid, Icon, Segment, Loader } from 'semantic-ui-react';

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
                playlists.current = result.data;
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
                    playlists.current, active === 'Y' ? true : false);
                playlists.current = updatePlaylistsSetCurrentlyActive(playlists.current, activePlaylists.current)
                updatePlaylistsCheckedUI(playlistRefs.current, playlists.current);
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
                    playlists.current, activePlaylists.current);
                playlists.current = updatePlaylistsSetCurrentlyActive(playlists.current, activePlaylists.current);
                updatePlaylistsCheckedUI(playlistRefs.current, playlists.current);
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
            if (playlists.current.length) {
                return playlists.current.map((playlist) => (
                    <Grid.Column>
                        <PlaylistSelectionItem 
                            playlist={ playlist }
                            onRemovePlaylist= { onRemovePlaylist }
                            ref={(element) => {
                                playlistRefs.current[parseInt(playlist.id)] = element;
                            }}
                            key={parseInt(playlist.id)}
                        />
                    </Grid.Column>
                    
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
        <Segment basic textAlign='center'>
            <Button.Group size='huge'>
                <AddPlaylistModal onAddPlaylist={ onAddPlaylist } />
                <Button basic color='grey' icon='check square' title='Select All' onClick={ () => { setPlaylistsActiveAll('Y')}} />
                <Button basic color='grey' icon='check square outline' title='Select None' onClick={ () => { setPlaylistsActiveAll('N')}} />
                <Button basic color='grey' icon='exchange' title='Invert Selection' onClick={ setPlaylistsActiveInverse } />
            </Button.Group>
        </Segment>
        {/* <Item.Group divided link>{ renderPlaylists() }</Item.Group> */}
        <Grid doubling columns={4}>
            { renderPlaylists() }
        </Grid>
      </div>
    );
  }
  
  export default PlaylistSelection;
  