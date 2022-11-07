
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
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
    <div className='App'>
        { authRender() }
        <ToastContainer autoClose={ 1500 } closeOnClick={ true } />
    </div>
  );
}

export default App;
