import React from 'react'
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ModalCreateChannel from './ModalCreateChannel'
import NotificationUnread from './NotificationUnread'

export default class ChannelList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false
    }
  }

  _openModal = () => {
    this.setState({modalOpen: true})
  }

  _closeModal = () => {
    this.setState({modalOpen: false})
  }

  _onSubmitChannel = (channelName) => {
    this.props.onSubmitChannel(channelName)
    this.setState({modalOpen: false})
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          <FlatList
            data={this.props.data}
            renderItem={({item}) => <Text onPress={() => this.props.onSelectChannel(item.id)} style={styles.item}><Icon style={styles.icon} name={item.icon.replace('_', '-')} />   {item.label} <NotificationUnread data={item}/></Text>}
            keyExtractor={(item, index) => index}
            getItemLayout={(data, index) => ({ length: 55, offset: 55 * index, index })}
          />
        </View>
        <TouchableOpacity onPress={this._openModal} style={styles.createChannel}>
            <Text style={styles.createChannelText}>
              <Icon name="add-circle-outline" style={styles.iconCreateChannel} color="#757575"/> Create a channel
            </Text>
        </TouchableOpacity>

        <ModalCreateChannel
          modalChannelOpen={this.state.modalOpen}
          onSubmitChannel={this._onSubmitChannel}
          closeModal={this._closeModal}/>
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
  notification: {
    color: '#cc273c'
  },
  container: {
    paddingTop: 20,
    backgroundColor: '#424242',
    flex: 1
  },
  createChannel: {
  },
  createChannelText: {
    fontSize: 25,
    paddingLeft: 5,
    color: '#757575'
  },
  iconCreateChannel: {
    fontSize: 20
  },
  modalCreate: {
    backgroundColor: '#424242',
    flex: 1
  },
  modalCreateHeader: {
    fontSize: 40,
    paddingTop: 20,
    textAlign: 'center',
    color: '#fff'
  }
});
