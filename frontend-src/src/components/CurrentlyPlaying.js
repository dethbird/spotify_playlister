import React, { useState, useEffect } from "react";
import { Icon, Item, Loader, Segment } from 'semantic-ui-react'

function CurrentlyPlaying() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [playingitem, sePlayingItem] = useState([]);

    useEffect(() => {
        fetch("/api/v1/me/player/currently-playing")
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              sePlayingItem(result);
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
                                    <Icon name='like' />
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
  