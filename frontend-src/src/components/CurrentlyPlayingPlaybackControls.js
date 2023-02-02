import React, { useContext } from "react";
import { Button, Icon } from 'semantic-ui-react'

import { AppContext } from "../contexts/AppContext";
import { next, previous, pause, play, getCurrentlyPlaying, liked } from '../api';

function CurrentlyPlayingPlaybackControls() {

    const { playingItem, setPlayingItem, setLikedResponse } = useContext(AppContext);

    const checkLiked = (trackId) => {
        liked(trackId)
        .then(
            (result) => {
                setLikedResponse(result.data);
            }
        )
    }

    const nextTrack = () => {
        next()
            .then(
                () => {
                    setTimeout(getCurrentlyPlayingTrack, 100);
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const previousTrack = () => {
        previous()
            .then(
                () => {
                    setTimeout(getCurrentlyPlayingTrack, 100);
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const pauseTrack = () => {
        pause()
            .then(
                () => {
                    setTimeout(getCurrentlyPlayingTrack, 100);
                },
                (error) => {
                    console.log(error)
                }
            )
    }
    const playTrack = () => {
        play()
            .then(
                () => {
                    setTimeout(getCurrentlyPlayingTrack, 100);
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const getCurrentlyPlayingTrack = () => {
        getCurrentlyPlaying()
            .then(
                (result) => {
                    setPlayingItem(result.data);
                    checkLiked(result.data.item.id);
                    if(result.data && result.data.is_playing === true) {
                        setTimeout(getCurrentlyPlayingTrack, result.data.item.duration_ms - result.data.progress_ms + 100);
                    }
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    return (
        <Button.Group icon size='huge'>
            <Button onClick={ previousTrack }>
                <Icon name='step backward' />
            </Button>
            <Button onClick={ playTrack } className={ playingItem.is_playing ? 'active' : null }>
                <Icon name='play' />
            </Button>
            <Button onClick={ pauseTrack } className={ !playingItem.is_playing ? 'active' : null }>
                <Icon name='pause' />
            </Button>
            <Button onClick={ nextTrack }>
                <Icon name='step forward' />
            </Button>
        </Button.Group>
    );
}

export default CurrentlyPlayingPlaybackControls;
