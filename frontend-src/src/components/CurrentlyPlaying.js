import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button, Item, Loader, Segment } from 'semantic-ui-react'

import { AppContext } from '../contexts/AppContext';
import { CurrentlyPlayingContext } from '../contexts/CurrentlyPlayingContext';
import { addToPlaylists, getCurrentlyPlaying, removeFromPlaylists } from '../api';
import CurrentlyPlayingPlaybackControls from './CurrentlyPlayingPlaybackControls';
import LikeButton from '../components/LikeButton';

function CurrentlyPlaying() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [playingItem, setPlayingItem] = useState(null);
    
    const { playlistRefs, activePlaylists } = useContext(AppContext);
   
    const reloadPlaylists = () => {
        for(const id in activePlaylists.current) {
            playlistRefs.current[activePlaylists.current[id]].props.getSpotifyPlaylist()
        }
    }

    useEffect(() => {
        getCurrentlyPlayingTrack();
    }, [])

    const getCurrentlyPlayingTrack = () => {
        getCurrentlyPlaying()
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPlayingItem(result.data);
                    if(result.data && result.data.is_playing === true) {
                        setTimeout(getCurrentlyPlayingTrack, 1000);
                    }
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const addTrackToPlaylists = () => {
        addToPlaylists(playingItem.item.uri)
            .then(
                () => {
                    setTimeout(reloadPlaylists, 100);
                    toast.success('Track added')
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const removeTrackFromPlaylists = () => {
        removeFromPlaylists(playingItem.item.uri)
            .then(
                () => {
                    setTimeout(reloadPlaylists, 100);
                    toast.error('Track removed')
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <Loader active />;
    } else {
        if (playingItem) {
            return (
                <CurrentlyPlayingContext.Provider value={{
                    setPlayingItem,
                    playingItem
                }}>
                    <Segment>
                        <Item.Group>
                            <Item>
                                <Item.Image src={ playingItem.item.album.images[1].url } size='medium' />
                                <Item.Content>
                                    <Item.Header>{ playingItem.item.name }</Item.Header>
                                    <Item.Description>{ playingItem.item.album.name }</Item.Description>
                                    <Item.Meta>
                                        ({ playingItem.item.album.release_date})
                                    </Item.Meta>
                                    <Item.Description>{ playingItem.item.artists[0].name }</Item.Description>
                                    <Item.Extra>
                                        
                                        <Button.Group size='huge'>
                                            <LikeButton trackId={ playingItem.item.id } />
                                            <Button basic color='green' icon='plus circle' title='Add to Selected Playlists' onClick={ addTrackToPlaylists } />
                                            <Button basic color='red' icon='times circle' title='Remove from Selected Playlists' onClick={ removeTrackFromPlaylists } />
                                            <Button basic color='blue' icon='sync' title="Show Me What's Playing" onClick={ getCurrentlyPlayingTrack }/>
                                        </Button.Group>
                                    </Item.Extra>
                                    <Item.Extra>
                                        <CurrentlyPlayingPlaybackControls />
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Segment>
                </CurrentlyPlayingContext.Provider>
            );
        }

        return <Segment textAlign='center' compact>
            Nothing's playing. Play something in Spotify then click the button below:<br />
            <Button basic color='blue' icon='sync' title="Show Me What's Playing" onClick={getCurrentlyPlayingTrack} size='huge'/>
        </Segment>
        
    }
}
  
export default CurrentlyPlaying;
  