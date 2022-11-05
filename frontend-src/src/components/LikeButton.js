import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Icon, Loader } from 'semantic-ui-react'

function LikeButton(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [likedResponse, setLikedResponse] = useState([]);

    const toggleLiked = () => {
        setIsLoaded(false);
        if(likedResponse[0]) {
            // unlike
            axios.delete(`/api/v1/me/tracks?ids=${props.trackId}`)
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
            axios.put(`/api/v1/me/tracks?ids=${props.trackId}`)
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

    useEffect(() => {
        axios.get(`/api/v1/me/tracks/contains?ids=${props.trackId}`)
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
  