import React from 'react'
import { StyleSheet } from 'react-native'
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base'

const currentUser = 'asendra@kaliop.com'

export default class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    console.log(this.props.users)
  }

  render() {
    return (
      <Container>
        <Header />
        <Content>
          <List dataArray={this.props.users}
            renderRow={(item) =>
            <ListItem avatar>
              <Left>
                <Thumbnail source={{uri: item.avatar}}/>
              </Left>
              <Body>
              <Text>{item.nickname}</Text>
              </Body>
            </ListItem>
          }>
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
});
