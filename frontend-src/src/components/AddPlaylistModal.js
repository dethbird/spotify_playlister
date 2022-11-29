import React, { useState } from "react";
import { Button, Divider, Loader, Modal, Pagination } from 'semantic-ui-react';

import { getPlaylistsSpotify, addPlaylist } from '../api';
import AddPlaylistModalPage from './AddPlaylistModalPage';

function AddPlaylistModal(props) {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [playlistPage, setPlaylistPage] = useState(null);
    const limit = 20;
    const [offset, setOffset] = useState(0);

    const fetchPage = (offset = 0) => {
          getPlaylistsSpotify(limit, offset)
          .then(
            (result) => {
                setIsLoaded(true);
                setPlaylistPage(result.data);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
          )
    }

    const onSelectPlaylist = (playlistId) => {
        setIsLoaded(false);
        addPlaylist(playlistId)
        .then(
            (result) => {
                setIsLoaded(true);
                setOpen(false);
                props.onAddPlaylist();
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
                setOpen(false);
            }
        )
    }

    const renderPage = () => {
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div><Loader active /></div>;
        } else {
            if (playlistPage) {
                return (
                    <AddPlaylistModalPage 
                        page={ playlistPage }
                        onSelectPlaylist={ onSelectPlaylist }
                    />
                );
            }
        }
    }

    const renderPagination = () => {
        if (playlistPage) {
            return (
                <div>
                    <Pagination 
                        totalPages={Math.ceil(playlistPage.total / playlistPage.limit)}
                        onPageChange={(event, data) => { 
                            setIsLoaded(false);
                            setOffset((parseInt(data.activePage) - 1) * limit);
                            fetchPage((parseInt(data.activePage) - 1) * limit);
                        }}
                    /><br />
                    <div>
                        { offset } - { offset + limit <= playlistPage.total ? offset + limit : playlistPage.total } of { playlistPage.total }
                    </div>
                </div>

            )
        }
    }

    return (
        <Modal
            closeIcon
            centered={false}
            onClose={() => setOpen(false)}
            onOpen={() => {
                    setOpen(true);
                    fetchPage();
                }
            }
            open={open}
            trigger={<Button basic color='grey' icon='plus' title='Add Playlist' />}
        >
            <Modal.Header>Select a Playlist</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    { renderPagination() }
                </Modal.Description>
                <Divider />
                <Modal.Description>
                    { renderPage() }
                </Modal.Description>
                <Divider />
                <Modal.Description>
                    { renderPagination() }
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='blue' onClick={() => setOpen(false)}>
                    Done
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default AddPlaylistModal;
