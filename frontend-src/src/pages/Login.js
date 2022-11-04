import { Button, Container, Icon, Image } from 'semantic-ui-react'

function Login() {
  return (
    <Container textAlign='center'>
      <Button as="a" href={ window.login_url } icon labelPosition='right' verticalAlign='middle'>
        <Image src='/images/Spotify_Logo.png' basic size='mini' floated='left' verticalAlign='middle' className='logo'/> Connect to Spotify <Icon name='right arrow' />
      </Button>
    </Container>
  );
}

export default Login;
