import axios from 'axios';
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { Button, Item, Loader, Segment } from 'semantic-ui-react'

import LikeButton from '../components/LikeButton';

function CurrentlyPlaying(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [playingItem, setPlayingItem] = useState(null);

    useEffect(() => {
        getCurrentlyPlaying();
    }, [])

    const getCurrentlyPlaying = () => {
        axios.get("/api/v1/me/player/currently-playing")
          .then(
            (result) => {
                setIsLoaded(true);
                setPlayingItem(result.data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
          )
    }

    const addToPlaylists = () => {
        // props.setPlaylistsLoaded(false);
        axios.put("/api/app/playlists/addtrack", {
            trackUri: playingItem.item.uri
        })
          .then(
            (result) => {
                setIsLoaded(true);
                props.fetchPlaylists();
                toast.success('Track added')
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
          )
    }

    const removeFromPlaylists = () => {
        // props.setPlaylistsLoaded(false);
        axios.patch("/api/app/playlists/removetrack", {
            trackUri: playingItem.item.uri
        })
          .then(
            (result) => {
                setIsLoaded(true);
                props.fetchPlaylists();
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
                                    <LikeButton trackId={ playingItem.item.id } />
                                    <Button.Group>
                                        <Button basic color='green' icon='plus circle' title='Add to Selected Playlists' onClick={ addToPlaylists } />
                                        <Button basic color='red' icon='times circle' title='Remove from Selected Playlists' onClick={ removeFromPlaylists } />
                                        <Button basic color='blue' icon='sync' title="Show Me What's Playing" onClick={ getCurrentlyPlaying }/>
                                    </Button.Group>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
                
            );
        }

        return <Segment textAlign='center' compact>
                    Nothing's playing. Play something in Spotify then click the button below:<br />
                    <Button basic color='blue' icon='sync' title="Show Me What's Playing" onClick={ getCurrentlyPlaying }/>
                </Segment>
        
    }
}
  
export default CurrentlyPlaying;
  