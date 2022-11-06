import axios from 'axios';
import React, { useState } from "react";

import { Container, Grid } from 'semantic-ui-react'
import CurrentlyPlaying from '../components/CurrentlyPlaying';
import PlaylistSelection from '../components/PlaylistSelection';
import User from '../components/User';

function Index() {
  const [playingItem, setPlayingItem] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistsError, setPlaylistsError] = useState(null);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);

  const fetchPlaylists = () => {
    axios.get('/api/app/playlists')
    .then(
        (result) => {
            setPlaylistsLoaded(true);
            setPlaylists(result.data);
        },
        (playlistsError) => {
            setPlaylistsLoaded(true);
            setPlaylistsError(playlistsError);
        }
    )
  }

  return (
    <Container>
      <Grid>
        <Grid.Column floated='left' width={12}>
          <CurrentlyPlaying
            playingItem={ playingItem }
            setPlayingItem={ setPlayingItem }
          />
        </Grid.Column>
        <Grid.Column floated='right' textAlign='right' width={4}>
          <User />
        </Grid.Column>
      </Grid>
      <PlaylistSelection 
          playingItem={ playingItem }
          fetchPlaylists={ fetchPlaylists }
          playlists={ playlists }
          error={ playlistsError }
          isLoaded={ playlistsLoaded }
      />
    </Container>
  );
}

export default Index;
