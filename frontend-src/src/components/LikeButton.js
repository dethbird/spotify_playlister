import React, { useState, useEffect } from "react";
import { Icon, Loader } from 'semantic-ui-react'

import { like, unlike, liked } from '../api';

function LikeButton(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [likedResponse, setLikedResponse] = useState([]);

    const toggleLiked = () => {
        setIsLoaded(false);
        if(likedResponse[0]) {
            // unlike
            unlike(props.trackId)
            .then(
                (result) => {
                    setIsLoaded(true);
                    setLikedResponse([false]);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        } else {
            // like
            like(props.trackId)
            .then(
                (result) => {
                    setIsLoaded(true);
                    setLikedResponse([true]);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }
    };

    const checkLiked = () => {
        liked(props.trackId)
        .then(
            (result) => {
                setIsLoaded(true);
                setLikedResponse(result.data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    useEffect(() => {
        checkLiked();
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <Loader active />;
    } else {
        if (likedResponse.length) {
            return (
                <Icon 
                    color={likedResponse[0] ? 'pink' : 'grey'}
                    name='like'
                    onClick={ toggleLiked }
                    title='Like / Unlike'
                />
            );
        }
    }
}
  
export default LikeButton;
  