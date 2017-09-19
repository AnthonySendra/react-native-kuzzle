import React from 'react'
import { StyleSheet, View, TextInput, KeyboardAvoidingView, Vibration, Alert} from 'react-native'
import Drawer from 'react-native-drawer'
import Kuzzle from 'kuzzle-sdk/dist/kuzzle.js'
import MessageList from './src/MessageList.js'
import ChannelList from './src/ChannelList'
import Header from './src/Header'

Kuzzle.prototype.bluebird = require('bluebird')
const kuzzle = new Kuzzle('10.34.50.59', {defaultIndex: 'foo'}, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected!');
  }
})
const messagesCollection = kuzzle.collection('slack-messages')
const usersCollection = kuzzle.collection('slack-users')
const channelsCollection = kuzzle.collection('slack')
const currentUser = 'asendra@kaliop.com'
let room

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      messages: [],
      channels: [],
      users: {},
      channel: 'kuzzle'
    }
  }

  componentWillUnmount() {
    room.unsubscribe()
  }

  async componentDidMount() {
    this._subscribeBump()
    await this._listUsers()
    await this._listChannels()
    await this._listMessages()
    await this._subscribeMessages()
  }

  _listUsers = async () => {
    try {
      const result = await usersCollection.searchPromise({}, {})
      const users = {}
      result.getDocuments().forEach(function(document) {
        users[document.id] = document.content
      })

      this.setState({users})
    } catch (err) {
      console.error(err)
    }
  }

  _bump = (userId) => {
    messagesCollection.publishMessage({
      event: 'bump',
      userId: currentUser,
      bumping: userId,
      back: true
    })
  }

  _subscribeBump = () => {
    const filter = {and: [{equals: {event: 'bump'}}, {equals: {bumping: currentUser}}]}
    messagesCollection
      .subscribe(filter, {subscribeToSelf: false, scope: 'in'}, (error, result) => {
        Vibration.vibrate(200, true)
        Alert.alert(
          'Bumped!',
          `${this.state.users[result.document.content.userId].nickname} bumped you`,
          [
            {text: `I'm not a kid, cancel`, onPress: () => {}},
            {text: 'Bump back!', onPress: () => this._bump(result.document.content.userId)}
          ],
          { cancelable: true })
      })
  }

  _subscribeMessages = () => {
    messagesCollection
      .subscribe({}, {subscribeToSelf: true, scope: 'in'}, (error, result) => {
        if (result.document.content.event === 'bump') {
          return
        }
        if (result.document.content.event === 'typing') {
          return
        }

        if (result.document.content.channel.replace('#', '') === this.state.channel) {
          this.setState({messages: [
            ...this.state.messages,
            {
              ...result.document.content,
              ...this.state.users[result.document.content.userId]
            }
          ]})
        } else {
          Vibration.vibrate(100, true)
          this._setChannelNotification(result.document.content.channel, true)
        }
      })
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return;
        }
        room = roomObject
      })
  }

  _listMessages = async () => {
    const query = {
      query: {term: {channel: this.state.channel}},
      sort: [{ timestamp: 'asc' }]
    }

    try {
      const result = await messagesCollection.searchPromise(query, { size: 100 })
      const messages = []
      result.getDocuments().forEach((document) => {
        messages.push({
          ...document.content,
          ...this.state.users[document.content.userId]
        })
      })

      this.setState({messages})
    } catch (err) {
      console.error(err)
    }
  }

  _listChannels = async () => {
    const query = { query: { terms: { type: ['public', 'restricted'] } } }
    try {
      const result = await channelsCollection.searchPromise(query)
      const channels = []
      result.getDocuments().forEach((document) => {
        channels.push({
          id: document.id,
          label: document.content.label,
          icon: document.content.icon.replace('default', 'forum'),
          unread: false
        })
      })

      this.setState({channels})
    } catch (err) {
      console.error(err)
    }
  }

  _onSubmitMessage = async () => {
    const message = {
      userId: currentUser,
      content: this.state.message,
      timestamp: Date.now(),
      channel: '#' + this.state.channel
    }

    try {
      await messagesCollection.createDocumentPromise(message)
      this.setState({message: ''})
    } catch (err) {
      console.error(err)
    }
  }

  _onSubmitChannel = async (label) => {
    const id = '#' + label
    const channel = {
      label,
      type: 'public',
      icon: 'forum'
    }

    try {
      await channelsCollection.createDocumentPromise(id, channel)
      this.setState({channels: [...this.state.channels, {...channel, id}]})
    } catch (err) {
      console.error(err)
    }
  }

  _showMenu = () => {
    this._drawer.open()
  }

  _setChannelNotification = (channelId, unread) => {
    const channels = this.state.channels.map(channelItem => {
      if (channelItem.id === channelId) {
        return {
          ...channelItem,
          unread
        }
      }
      return channelItem
    })

    this.setState({channels})
  }

  _onSelectChannel = (channel) => {
    this.setState({channel: channel.replace('#', '')})
    this._setChannelNotification(channel, false)

    setTimeout(async () => {
      await this._listMessages()
      this._drawer.close()
    }, 0)
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" >
        <Drawer
          type="overlay"
          ref={(ref) => this._drawer = ref}
          tapToClose={true}
          openDrawerOffset={0.2}
          panCloseMask={0.2}
          closedDrawerOffset={-3}
          content={<ChannelList
            data={this.state.channels}
            onSubmitChannel={this._onSubmitChannel}
            onSelectChannel={this._onSelectChannel} />
          }
        >
          <Header showMenu={this._showMenu} channel={this.state.channel}/>
          <View style={styles.containerList}>
            <MessageList
              ref={(ref) => this._messageList = ref}
              data={this.state.messages}>
            </MessageList>
          </View>
          <View style={styles.footer}>
            <TextInput
              style={styles.input}
              placeholder="Write your message"
              onSubmitEditing={this._onSubmitMessage}
              onChangeText={message => this.setState({message})}
              value={this.state.message}
              underlineColorAndroid="transparent"
            />
          </View>
        </Drawer>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  containerList: {
    flex: 1
  },
  input: {
    borderTopWidth: 2,
    borderColor: '#424242',
    backgroundColor: '#595959',
    height: 50,
    paddingLeft: 10,
    color: '#fff'
  },
  footer: {
    height: 50
  }
});
