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

// Add playlist
export const addPlaylist = (id) => {
    return axios.put('/api/app/playlist', {
        playlistId: id
    })
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

// Add track to playlist
export const addToPlaylist = (track_uri, playlistId) => {
    return axios.put(`/api/app/playlist/${playlistId}/addtrack`, {
        trackUri: track_uri
    })
}

// Remove track from playlist
export const removeFromPlaylist = (track_uri, playlistId) => {
    return axios.patch(`/api/app/playlist/${playlistId}/removetrack`, {
        trackUri: track_uri
    })
}

// Favorite / unfavorite spotify playlist
export const favorite = (spotifyPlaylistId, favorite) => {
    return axios.put(`/api/app/playlist/favorite/${spotifyPlaylistId}`, {
        favorite
    })
}

// is spotify playlist favorited
export const favorited = (spotifyPlaylistId) => {
    return axios.get(`/api/app/playlist/favorited/${spotifyPlaylistId}`)
}

// get favorited playlists
export const favorites = () => {
    return axios.get(`/api/app/playlist/favorites`)
}

 

/** Spotify endpoints ----------------------------- */

// Get playlist
export const getPlaylist = (spotifyPlaylistId) => {
    return axios.get(`/api/v1/playlists/${spotifyPlaylistId}`)
}

// Get playlists paginated
export const getPlaylistsSpotify = (limit, offset) => {
    return axios.get('/api/v1/me/playlists', {
        params: {
          limit,
          offset
        }
    })
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

// Like track
export const like = (track_id) => {
    return axios.put(`/api/v1/me/tracks?ids=${track_id}`)
}

// Unlike track
export const unlike = (track_id) => {
    return axios.delete(`/api/v1/me/tracks?ids=${track_id}`)
}

// Is track liked
export const liked = (track_id) => {
    return axios.get(`/api/v1/me/tracks/contains?ids=${track_id}`)
}