import axios from 'axios';

/** App endpoints ----------------------------------*/

// Get all playlists
export const getPlaylists = () => {
    return axios.get('/api/app/playlists')
}

// Delete playlist
export const deletePlaylist = (id) => {
    return axios.delete(`/api/app/playlist/${id}`)
}

// Set playlist active Y / N
export const setPlaylistActive = (id, active) => {
    return axios.patch(`/api/app/playlist/${id}/active`, {
        'active' : active
    })
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

// Add track to playlists
export const addToPlaylists = (track_uri) => {
    return axios.put('/api/app/playlists/addtrack', {
        trackUri: track_uri
    })
}

// Remove track from playlists
export const removeFromPlaylists = (track_uri) => {
    return axios.patch('/api/app/playlists/removetrack', {
        trackUri: track_uri
    })
}

/** Spotify endpoints ----------------------------- */

// Get playlist
export const getPlaylist = (spotifyPlaylistId) => {
    return axios.get(`/api/v1/playlists/${spotifyPlaylistId}`)
}

// Get currently playing 
export const getCurrentlyPlaying = () => {
    return axios.get('/api/v1/me/player/currently-playing')
}

// Next track
export const next = () => {
    return axios.post("/api/v1/me/player/next")
}

// Previous track
export const previous = () => {
    return axios.post("/api/v1/me/player/previous")
}

// Pause track
export const pause = () => {
    return axios.put("/api/v1/me/player/pause")
}

// Play track
export const play = () => {
    return axios.put("/api/v1/me/player/play")
}