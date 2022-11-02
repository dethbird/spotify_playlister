import { Button } from 'semantic-ui-react';

function Login() {
  return (
    <Button as="a" href={ window.login_url }>Connect to Spotify</Button>
  );
}

export default Login;
