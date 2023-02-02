import React, { useState, useContext } from "react";
import { Button } from 'semantic-ui-react'

import { like, unlike } from '../api';
import { AppContext } from '../contexts/AppContext';

function LikeButton() {
    const [error, setError] = useState(null);

    const {
        playingItem,
        setLikedResponse,
        likedResponse
    } = useContext(AppContext);

    const toggleLiked = () => {
        if(likedResponse[0]) {
            // unlike
            unlike(playingItem.item.id)
            .then(
                (result) => {
                    setLikedResponse([false]);
                },
                (error) => {
                    setError(error);
                }
            )
        } else {
            // like
            like(playingItem.item.id)
            .then(
                (result) => {
                    setLikedResponse([true]);
                },
                (error) => {
                    setError(error);
                }
            )
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    } else {
        return <Button basic color={likedResponse.length && likedResponse[0] ? 'pink' : 'grey'} icon='like' title='Like / Unlike' onClick={ toggleLiked } />
    }
}
  
export default LikeButton;
  