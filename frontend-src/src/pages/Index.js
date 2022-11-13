import axios from 'axios';
import React, { useState } from "react";

import { Container, Grid } from 'semantic-ui-react'
import CurrentlyPlaying from '../components/CurrentlyPlaying';
import PlaylistSelection from '../components/PlaylistSelection';
import User from '../components/User';

function Index() {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchPlaylists = () => {
    axios.get('/api/app/playlists')
      .then(
        (result) => {
          setIsLoaded(true);
          setPlaylists(result.data);
        },
        (playlistsError) => {
          setIsLoaded(true);
          setError(playlistsError);
        }
      )
  }

  return (
    <Container>
      <Grid>
        <Grid.Column floated='left' width={12}>
          <CurrentlyPlaying fetchPlaylists={ fetchPlaylists } setPlaylistsLoaded={ setIsLoaded } />
        </Grid.Column>
        <Grid.Column floated='right' textAlign='right' width={4}>
          <User />
        </Grid.Column>
      </Grid>
      <PlaylistSelection 
        fetchPlaylists={ fetchPlaylists }
        playlists={ playlists }
        error={ error }
        setError={ setError }
        isLoaded={ isLoaded } 
        setIsLoaded={ setIsLoaded }
      />
    </Container>
  );
}

export default Index;
