import React, { useRef, useState } from "react";
import { Container, Grid } from 'semantic-ui-react'

import { AppContext } from '../contexts/AppContext';
import CurrentlyPlaying from '../components/CurrentlyPlaying';
import PlaylistSelection from '../components/PlaylistSelection';
import User from '../components/User';

function Index() {
  const playlists = useRef([]);
  const [playlistsError, setPlaylistsError] = useState(null);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);
  const activePlaylists = useRef([]);
  const playlistRefs = useRef([]);
  const [playingItem, setPlayingItem] = useState(null);

  return (
    <AppContext.Provider value={
      {
        playlists,
        playlistsError,
        setPlaylistsError,
        playlistsLoaded,
        setPlaylistsLoaded,
        activePlaylists,
        playlistRefs,
        playingItem,
        setPlayingItem
      }
    }>
      <Container>
        <Grid>
          <Grid.Column floated='left' width={12}>
            <CurrentlyPlaying />
          </Grid.Column>
          <Grid.Column floated='right' textAlign='right' width={4}>
            <User />
          </Grid.Column>
        </Grid>
        <PlaylistSelection />
      </Container>
    </AppContext.Provider>
  );
}

export default Index;
