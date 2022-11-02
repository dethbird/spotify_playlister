import { Image } from 'semantic-ui-react';

function User() {
    const user_image = window.spotify_user.images[0].url
    return (
        <div>
            <Image avatar src={ user_image } />
            <span>{ window.spotify_user.display_name }</span>
        </div>
    );
  }
  
  export default User;
  