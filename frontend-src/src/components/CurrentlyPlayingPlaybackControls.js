import React, { useState } from "react";
import { Button, Icon } from 'semantic-ui-react'

import { next, previous, pause, play } from '../api';

function CurrentlyPlayingPlaybackControls(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const nextTrack = () => {
        next()
            .then(
                () => {
                    setIsLoaded(true);
                    setTimeout(props.getCurrentlyPlaying, 250);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const previousTrack = () => {
        previous()
            .then(
                () => {
                    setIsLoaded(true);
                    setTimeout(props.getCurrentlyPlaying, 250);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const pauseTrack = () => {
        pause()
            .then(
                () => {
                    setIsLoaded(true);
                    setTimeout(props.getCurrentlyPlaying, 250);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }
    const playTrack = () => {
        play()
            .then(
                () => {
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
            <Button onClick={ previousTrack }>
                <Icon name='step backward' />
            </Button>
            <Button onClick={ playTrack }>
                <Icon name='play' />
            </Button>
            <Button onClick={ pauseTrack }>
                <Icon name='pause' />
            </Button>
            <Button onClick={ nextTrack }>
                <Icon name='step forward' />
            </Button>
        </Button.Group>
    );
}

export default CurrentlyPlayingPlaybackControls;
