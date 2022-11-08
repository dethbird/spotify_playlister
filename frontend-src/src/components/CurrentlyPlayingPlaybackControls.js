import axios from 'axios';
import React, { useState } from "react";
import { Button, Icon } from 'semantic-ui-react'

function CurrentlyPlayingPlaybackControls(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const next = () => {
        axios.post("/api/v1/me/player/next")
            .then(
                (result) => {
                    setIsLoaded(true);
                    setTimeout(props.getCurrentlyPlaying, 250);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const previous = () => {
        axios.post("/api/v1/me/player/previous")
            .then(
                (result) => {
                    setIsLoaded(true);
                    setTimeout(props.getCurrentlyPlaying, 250);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const pause = () => {
        axios.put("/api/v1/me/player/pause")
            .then(
                (result) => {
                    setIsLoaded(true);
                    setTimeout(props.getCurrentlyPlaying, 250);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }
    const play = () => {
        axios.put("/api/v1/me/player/play")
            .then(
                (result) => {
                    setIsLoaded(true);
                    setTimeout(props.getCurrentlyPlaying, 250);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    return (
        <Button.Group icon>
            <Button onClick={ previous }>
                <Icon name='step backward' />
            </Button>
            <Button onClick={ play }>
                <Icon name='play' />
            </Button>
            <Button onClick={ pause }>
                <Icon name='pause' />
            </Button>
            <Button onClick={ next }>
                <Icon name='step forward' />
            </Button>
        </Button.Group>
    );
}

export default CurrentlyPlayingPlaybackControls;
