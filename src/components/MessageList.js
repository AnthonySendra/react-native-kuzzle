import React from 'react'
import { StyleSheet, Keyboard } from 'react-native'
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Card, CardItem } from 'native-base'
import defaultStyles from '../styles'

export default class MessageList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        if (this.list) {
          this.list._root.scrollToEnd()
        }
      }, 100)
    })
  }

  render() {
    if (!this.props.data.length) {
      return (
        <Container>
          <Content>
            <Card >
              <CardItem>
                <Body>
                  <Text>This discussion is empty, try saying something nice!</Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container>)
    }

    return (
      <List
        ref={(ref) => this.list = ref}
        dataArray={this.props.data}
        onContentSizeChange={() => this.list._root.scrollToEnd()}
        renderRow={(item) =>
          <ListItem  avatar style={styles.listItem}>
            <Left>
              <Thumbnail source={{uri: item.avatar}} style={styles.thumbnail}/>
            </Left>
            <Body>
              <Text>{item.nickname}</Text>
              <Text style={styles.message} note>{item.content}</Text>
            </Body>
          </ListItem>
        }>
      </List>
    )
  }
}

const styles = StyleSheet.create({
  listItem: {
    marginLeft: 0,
    borderBottomWidth: 0
  },
  thumbnail: {
    marginLeft: 10,
    width: 40,
    height: 40
  },
  nickname: {
    color: defaultStyles.primaryTextColor
  },
  message: {
    color: defaultStyles.ligtherTextColor,
    fontSize: 16
  },
  emptyCard: {
    height: 50
  }
});