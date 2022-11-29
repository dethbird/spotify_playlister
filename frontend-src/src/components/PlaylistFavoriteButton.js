import React, { useState, useEffect } from "react";
import { Button, Loader } from 'semantic-ui-react'

import { favorite, favorited } from '../api';

function PlaylistFavoriteButton({ spotifyPlaylistId }) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const toggleFavorited = () => {
        setIsLoaded(false);
        if(isFavorited) {
            // unfavorite
            favorite(spotifyPlaylistId, false)
            .then(
                (result) => {
                    setIsLoaded(true);
                    setIsFavorited(false);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        } else {
            // favorite
            favorite(spotifyPlaylistId, true)
            .then(
                (result) => {
                    setIsLoaded(true);
                    setIsFavorited(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }
    };

    const checkFavorited = () => {
        favorited(spotifyPlaylistId)
        .then(
            (result) => {
                setIsLoaded(true);
                setIsFavorited(result.data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    useEffect(() => {
        checkFavorited();
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <Loader active />;
    } else {
        return (
            <Button size='mini' color={isFavorited ? 'yellow' : 'grey'} basic icon='star' title='Favorite / Unfavorite' onClick={ toggleFavorited } />
        );
    }
}
  
export default PlaylistFavoriteButton;
  