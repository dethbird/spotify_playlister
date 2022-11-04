import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Button, Item, Loader, Segment } from 'semantic-ui-react'

import LikeButton from '../components/LikeButton';

function CurrentlyPlaying() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [playingitem, sePlayingItem] = useState([]);

    useEffect(() => {
        axios.get("/api/v1/me/player/currently-playing")
          .then(
            (result) => {
                setIsLoaded(true);
                sePlayingItem(result.data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
          )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <Loader active />;
    } else {
        if (playingitem) {
            return (
                <Segment>
                    <Item.Group>
                        <Item>
                            <Item.Image src={ playingitem.item.album.images[1].url } size='medium' />

                            <Item.Content>
                                <Item.Header>{ playingitem.item.name }</Item.Header>
                                <Item.Meta>
                                    {`${playingitem.item.album.name}  (${playingitem.item.album.release_date})`}
                                </Item.Meta>
                                <Item.Description>{ playingitem.item.artists[0].name }</Item.Description>
                                <Item.Extra>
                                    <LikeButton trackId={ playingitem.item.id } />
                                    <Button.Group>
                                        <Button basic color='green' icon='plus circle' title='Add to Selected Playlists' />
                                        <Button basic color='grey' icon='times circle' title='Remove from Selected Playlists' />
                                    </Button.Group>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
                
            );
        }

        return <div>Nothing's playing</div>
        
    }
}
  
export default CurrentlyPlaying;
  