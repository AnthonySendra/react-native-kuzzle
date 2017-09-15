import React from 'react'
import { View, StyleSheet, Text, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class ChannelList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          <FlatList
            data={this.props.data}
            renderItem={({item}) => <Text onPress={() => this.props.onSelect(item.id)} style={styles.item}><Icon style={styles.icon} name={item.icon.replace('_', '-')} />   {item.label}</Text>}
            keyExtractor={(item, index) => index}
            getItemLayout={(data, index) => ({ length: 55, offset: 55 * index, index })}
          />
        </View>
        <View style={styles.createChannel}>
          <Text style={styles.createChannelText}>
            <Icon name="add-circle-outline" style={styles.iconCreateChannel} color="#757575"/> Create a channel
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    height: 44,
    color: '#fff',
    fontSize: 23,
    paddingLeft: 10,
    marginBottom: 10,
  },
  icon: {
    fontSize: 20
  },
  container: {
    paddingTop: 20,
    backgroundColor: '#424242',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  createChannel: {
    flex: 1
  },
  createChannelText: {
    fontSize: 25,
    paddingLeft: 5,
    color: '#757575'
  },
  iconCreateChannel: {
    fontSize: 20
  }
});
