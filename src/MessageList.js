import React from 'react'
import { StyleSheet, FlatList, Keyboard } from 'react-native'
import Message from './Message'

export default class MessageList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => {
      this._flatList.scrollToEnd()
    }, 1000)
  }

  componentDidUpdate() {
    setTimeout(() => {
      this._flatList.scrollToEnd()
    }, 0)
  }

  render() {
    return (
      <FlatList
        style={styles.list}
        ref={(ref) => this._flatList = ref}
        data={this.props.data}
        renderItem={({item}) => <Message data={item} />}
        keyExtractor={(item, index) => index}
      />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 10,
    backgroundColor: '#424242'
  }
});
