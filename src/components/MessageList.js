import React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base'
import defaultStyles from '../styles'

export default class MessageList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => {
      if (!this.list) {
        return
      }

      this.list._root.scrollToEnd()
    }, 500)
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.list._root.scrollToEnd()
    }, 0)
  }

  render() {
    return (
      <List
        ref={(ref) => this.list = ref}
        dataArray={this.props.data}
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
  }
});