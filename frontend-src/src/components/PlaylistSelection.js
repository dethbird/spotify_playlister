import { Button } from 'semantic-ui-react';
import AddPlaylistModal from './AddPlaylistModal';

function PlaylistSelection() {
    return (
      <div className='playlist-selection'>
        <Button.Group>
            <AddPlaylistModal />
            <Button basic color='grey' icon='check square' title='Select All' />
            <Button basic color='grey' icon='check square outline' title='Select None' />
            <Button basic color='grey' icon='exchange' title='Invert Selection' />
        </Button.Group>
        <div>My Playlists</div>
      </div>
    );
  }
  
  export default PlaylistSelection;
  