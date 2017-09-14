import React from 'react'
import { StyleSheet, Text, FlatList } from 'react-native'

export default class ChannelList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <FlatList
        data={this.props.data}
        renderItem={({item}) => <Text onPress={() => this.props.onSelect(item)} style={styles.item}>{item}</Text>}
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
  }
});
