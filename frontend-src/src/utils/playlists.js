export const extractActivePlaylistIds = (playlistResult) => {
    return playlistResult.filter(playlist => playlist.active === 'Y').map(playlist => parseInt(playlist.id))
}

export const updateActivePlaylists = (current = [], playlistId, active) => {
    let newActive = [];
    newActive = current.filter(id => parseInt(playlistId) != parseInt(id));
    if (active) {
        newActive.push(parseInt(playlistId));
    }
    return newActive;
}