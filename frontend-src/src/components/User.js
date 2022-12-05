import { Container, Icon, Image } from 'semantic-ui-react';

function User() {
    const user_image = window.spotify_user.images[0].url
    return (
        <Container textAlign='right'>
            <Image avatar src={ user_image } />
            <span>{ window.spotify_user.display_name }</span>
            &nbsp;&nbsp;<a href="/logout" title="Logout"><Icon name='sign-out' size='small' /></a>
        </Container>
    );
  }
  
  export default User;
  