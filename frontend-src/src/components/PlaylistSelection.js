import { Button } from 'semantic-ui-react';

function PlaylistSelection() {
    return (
      <div className='playlist-selection'>
        <Button.Group>
            <Button basic color='green' icon='plus' title='Add Playlist' />
            <Button basic color='grey' icon='check square' title='Select All' />
            <Button basic color='grey' icon='check square outline' title='Select None' />
            <Button basic color='grey' icon='exchange' title='Invert Selection' />
        </Button.Group>
        <div>My Playlists</div>
      </div>
    );
  }
  
  export default PlaylistSelection;
  