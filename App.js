import React from 'react'
import { StyleSheet, Text, View, FlatList, TextInput, KeyboardAvoidingView, Button } from 'react-native'
import Drawer from 'react-native-drawer'
import Kuzzle from 'kuzzle-sdk/dist/kuzzle.js'
import MessageList from './MessageList.js'
import ChannelList from './ChannelList'
import Header from './Header'

const kuzzle = new Kuzzle('10.34.50.59', {defaultIndex: 'foo'}, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected!');
  }
})
const messagesCollection = kuzzle.collection('slack-messages')
const channelsCollection = kuzzle.collection('slack')
let room

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      messages: [],
      channels: [],
      channel: 'kuzzle'
    }
  }

  componentWillUnmount() {
    room.unsubscribe()
  }

  componentDidMount() {
    this._listChannels()
    this._listMessages()

    messagesCollection
      .subscribe({}, {subscribeToSelf: false, scope: 'in'}, (error, result) => {
        this.setState({messages: [...this.state.messages, result.document.content.message]})
      })
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return;
        }
        room = roomObject
      })
  }

  _listMessages = () => {
    messagesCollection
      .search({ query: { term: { channel: this.state.channel} }, sort: [{ timestamp: 'asc' }] }, { size: 100 }, (err, result) => {
        let messages = []
        result.getDocuments().forEach(function(document) {
          messages.push(document.content.content)
        })

        this.setState({messages})
      })
  }

  _listChannels = () => {
    channelsCollection
      .search({ query: { terms: { type: ['public', 'restricted'] } } }, (err, result) => {
        let channels = []
        result.getDocuments().forEach(function(document) {
          channels.push({
            id: document.id,
            label: document.content.label,
            icon: document.content.icon.replace('default', 'forum')
          })
        })

        this.setState({channels})
      })
  }

  _onSubmitMessage = () => {
    const message = {
      userId: 'asendra@kaliop.com',
      content: this.state.message,
      timestamp: Date.now(),
      channel: '#' + this.state.channel
    }

    messagesCollection
      .createDocument(message, (err, res) => {
        if (err) {
          console.error(err)
          return
        }
        this.setState({message: '', messages: [...this.state.messages, this.state.message]})
      })
  }

  _onSubmitChannel = (label) => {
    const id = '#' + label
    const channel = {
      label,
      type: 'public',
      icon: 'forum'
    }

    channelsCollection
      .createDocument(id, channel, (err, res) => {
        if (err) {
          console.error(err)
          return
        }
        this.setState({channels: [...this.state.channels, {...channel, id}]})
      })
  }

  _showMenu = () => {
    this._drawer.open()
  }

  _onSelectChannel = (channel) => {
    this.setState({channel: channel.replace('#', '')})
    setTimeout(() => {
      this._listMessages()
      this._drawer.close()
    }, 0)
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
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
    paddingTop: 22
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
