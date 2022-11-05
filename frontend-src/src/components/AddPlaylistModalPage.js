import { Button, Icon, Item, Label } from 'semantic-ui-react'

function AddPlaylistModalPage(props) {

    const renderItems = () => {
        return props.page.items.map(playlist => (
            <Item key={ playlist.id }>
                <Item.Image size='tiny' src={ playlist.images[0].url } />
                <Item.Content>
                    <Item.Header as='a' href={playlist.external_urls.spotify} target='_blank'>{ playlist.name }</Item.Header>
                    <Item.Description>{ playlist.description }</Item.Description>
                    <Item.Meta>
                        by { playlist.owner.display_name}
                    </Item.Meta>
                    <Item.Extra>
                        <Label><Icon name='music' />{ playlist.tracks.total } track(s)</Label>
                        <Button color='green' floated='right'>Select <Icon name='chevron right' /></Button>
                    </Item.Extra>
                </Item.Content>
            </Item>
        ));
    }

    return (
        <Item.Group divided link>{ renderItems() }</Item.Group>
    );
}

export default AddPlaylistModalPage;
