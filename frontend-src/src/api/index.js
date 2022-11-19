import axios from 'axios';

/** App endpoints */
// Get all playlists
export const getPlaylists = () => {
    return axios.get('/api/app/playlists')
}

// Set all playlists active / inactive
export const setActiveAll = (active) => {
    return axios.patch(`/api/app/playlists/active`, {
        'active' : active
    })
}

// Invert active status
export const setActiveInverse = () => {
    return axios.patch(`/api/app/playlists/invertactive`)
}

/** Spotify endpoints */