import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Button, Icon, Item, Loader } from 'semantic-ui-react';
import AddPlaylistModal from './AddPlaylistModal';
import PlaylistSelectionItem from './PlaylistSelectionItem';


function PlaylistSelection(props) {
    // const [playlists, setPlaylists] = useState([]);
    // const [error, setError] = useState(null);
    // const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        props.fetchPlaylists();
    }, []);

    // const fetchPlaylists = () => {
    //   axios.get('/api/app/playlists')
    //   .then(
    //       (result) => {
    //             setIsLoaded(true);
    //             setPlaylists(result.data);
    //       },
    //       (playlistsError) => {
    //             setIsLoaded(true);
    //             setError(playlistsError);
    //       }
    //   )
    // }

    const setActiveAll = (active) => {
        axios.patch(`/api/app/playlists/active`, {
            'active' : active
        })
        .then(
            () => {
                props.setIsLoaded(false);
                props.fetchPlaylists();
            },
            (error) => {
                props.setError(error);
            }
        )
    }

    const setActiveInverse = () => {
        axios.patch(`/api/app/playlists/invertactive`)
        .then(
            () => {
                props.setIsLoaded(false);
                props.fetchPlaylists();
            },
            (error) => {
                props.setError(error);
            }
        )
    }

    const onRemovePlaylist = () => {
        props.setIsLoaded(false);
        props.fetchPlaylists();
    }

    const onAddPlaylist = () => {
        props.setIsLoaded(false);
        props.fetchPlaylists();
    }

    const renderPlaylists = () => {
        if (props.error) {
            return <div>Error: {props.error.message}</div>;
        } else if (!props.isLoaded) {
            return <Loader active />;
        } else {
            if (props.playlists.length) {
                return props.playlists.map(playlist => (
                    <PlaylistSelectionItem 
                        spotifyPlaylistId={ playlist.spotify_playlist_id }
                        id={ playlist.id }
                        active={ playlist.active }
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
            <Button basic color='grey' icon='check square' title='Select All' onClick={ () => { setActiveAll('Y')}} />
            <Button basic color='grey' icon='check square outline' title='Select None' onClick={ () => { setActiveAll('N')}} />
            <Button basic color='grey' icon='exchange' title='Invert Selection' onClick={ setActiveInverse } />
        </Button.Group>
        <Item.Group divided link>{ renderPlaylists() }</Item.Group>
      </div>
    );
  }
  
  export default PlaylistSelection;
  