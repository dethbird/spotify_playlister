import { Container, Grid } from 'semantic-ui-react'

import CurrentlyPlaying from '../components/CurrentlyPlaying';
import PlaylistSelection from '../components/PlaylistSelection';
import User from '../components/User';

function Index() {
  return (
    <Container>
      <Grid>
        <Grid.Column floated='left' width={8}>
          <CurrentlyPlaying />
        </Grid.Column>
        <Grid.Column floated='right' textAlign='right' width={8}>
          <User />
        </Grid.Column>
      </Grid>
      <PlaylistSelection />
    </Container>
  );
}

export default Index;
