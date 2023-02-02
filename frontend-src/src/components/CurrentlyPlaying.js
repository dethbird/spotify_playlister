import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button, Item, Loader, Segment } from 'semantic-ui-react'

import { AppContext } from '../contexts/AppContext';
import { addToPlaylists, getCurrentlyPlaying, removeFromPlaylists, liked } from '../api';
import CurrentlyPlayingPlaybackControls from './CurrentlyPlayingPlaybackControls';
import LikeButton from '../components/LikeButton';

function CurrentlyPlaying() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { playlistRefs, activePlaylists, playingItem, setPlayingItem, setLikedResponse } = useContext(AppContext);
   
    const reloadPlaylists = () => {
        for(const id in activePlaylists.current) {
            playlistRefs.current[activePlaylists.current[id]].props.getSpotifyPlaylist()
        }
    }

    const checkLiked = (trackId) => {
        liked(trackId)
        .then(
            (result) => {
                setLikedResponse(result.data);
            },
            (error) => {
                setError(error);
            }
        )
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
                    checkLiked(result.data.item.id);
                    if(result.data && result.data.is_playing === true) {
                        setTimeout(getCurrentlyPlayingTrack, result.data.item.duration_ms - result.data.progress_ms + 100);
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
                    reloadPlaylists();
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
                    reloadPlaylists();
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
                                        <LikeButton 
                                            trackId={ playingItem.item.id}
                                        />
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
            );
        }

        return <Segment textAlign='center' compact>
            Nothing's playing. Play something in Spotify then click the button below:<br />
            <Button basic color='blue' icon='sync' title="Show Me What's Playing" onClick={getCurrentlyPlayingTrack} size='huge'/>
        </Segment>
        
    }
}
  
export default CurrentlyPlaying;
  