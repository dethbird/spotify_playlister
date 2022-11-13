import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Button, Icon, Item, Loader } from 'semantic-ui-react';
import AddPlaylistModal from './AddPlaylistModal';
import PlaylistSelectionItem from './PlaylistSelectionItem';


function PlaylistSelection(props) {

    useEffect(() => {
        props.fetchPlaylists();
    }, []);

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
                        playlist={ playlist }
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
  