import React from 'react'
import { View, StyleSheet, Text, FlatList } from 'react-native'

export default class MessageList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('scrolling list to the end')
    this._flatList.scrollToEnd()
  }

  render() {
    return (
      <FlatList
        style={styles.list}
        ref={(ref) => this._flatList = ref}
        data={this.props.data}
        renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
        keyExtractor={(item, index) => index}
        getItemLayout={(data, index) => ({ length: 55, offset: 55 * index, index })}
      />
    )
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#fff'
  },
  list: {
    backgroundColor: '#424242'
  }
});
