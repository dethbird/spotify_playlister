export const extractActivePlaylistIds = (playlistResult) => {
    return playlistResult.filter(playlist => playlist.active === 'Y').map(playlist => parseInt(playlist.id))
}

export const updateActivePlaylists = (current = [], playlistId, active) => {
    let newActive = [];
    newActive = current.filter(id => parseInt(playlistId) !== parseInt(id));
    if (active) {
        newActive.push(parseInt(playlistId));
    }
    return newActive;
}

export const setActivePlaylistsAll = (playlistsResult, active) => {
    if (active === false) {
        return [];
    } else {
        return playlistsResult.map(playlist => parseInt(playlist.id));
    }

}

export const setActivePlaylistsInverse = (playlists, current) => {
    return playlists.filter(playlist => !current.includes(parseInt(playlist.id))).map(playlist => parseInt(playlist.id))
}

export const updatePlaylistsSetCurrentlyActive = (playlists, current) => {
    let newPlaylists = [];
    for (const i in playlists) {
        let playlist = playlists[i];
        playlist.active = current.includes(parseInt(playlist.id)) ? 'Y' : 'N';
        newPlaylists.push(playlist)
    }
    return newPlaylists;
}

export const updatePlaylistsCheckedUI = (refs, playlists) => {
    for (const i in playlists) {
        // console.log(refs[parseInt(playlists[i].id)]);
        refs[parseInt(playlists[i].id)].state.checked = playlists[i].active === 'Y' ? true : false
        refs[parseInt(playlists[i].id)].inputRef.current.checked = playlists[i].active === 'Y' ? true : false
    }
}