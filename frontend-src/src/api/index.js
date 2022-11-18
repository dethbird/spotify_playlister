import axios from 'axios';

/** App endpoints */
export const getPlaylists = () => {
    return axios.get('/api/app/playlists')
}

/** Spotify endpoints */