import { Container } from 'semantic-ui-react'

import Index from './pages/Index'
import Login from './pages/Login'

function authRender() {
  if (window.user === null) {
    return <Login />
  } else {
    return <Index />
  }
}

function App() {
  console.log(window.user, window.spotify_user);
  return (
    <div>
        { authRender() }
    </div>
  );
}

export default App;
