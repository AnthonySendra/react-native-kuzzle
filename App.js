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
      channel: '#kuzzle'
    }
  }

  _listMessages = () => {
    messagesCollection
      .search({ query: { term: { channel: this.state.channel.replace('#', '')} }, sort: [{ timestamp: 'asc' }] }, { size: 100 }, (err, result) => {
        let messages = []
        result.getDocuments().forEach(function(document) {
          messages.push(document.content.content)
        })

        this.setState({messages})
        // setTimeout(() => {
        //   this._flatList.scrollToEnd();
        // }, 100)
      })
  }

  _listChannels = () => {
    channelsCollection
      .search({ query: { terms: { type: ['public', 'restricted'] } } }, (err, result) => {
        let channels = []
        result.getDocuments().forEach(function(document) {
          channels.push(document.id)
        })

        this.setState({channels})
      })
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

  _onSubmit = () => {
    messagesCollection
      .createDocument({message: this.state.message}, (err, res) => {
        if (err) {
          console.error(err)
          return
        }
        this.setState({message: '', messages: [...this.state.messages, this.state.message]})
        // this._flatList.scrollToIndex({
        //   index: this.state.messages.length - 1,
        //   animated: true
        // });
      })
  }

  _showMenu = () => {
    this._drawer.open()
  }

  componentWillUnmount() {
    room.unsubscribe()
  }

  _selectChannel = (channel) => {
    this.setState({channel})
    this._listMessages()
    this._drawer.close()
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Drawer
          type="static"
          tweenHandler={Drawer.tweenPresets.parallax}
          ref={(ref) => this._drawer = ref}
          tapToClose={true}
          openDrawerOffset={100}
          content={<ChannelList data={this.state.channels} onSelect={this._selectChannel} />}
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
              onSubmitEditing={this._onSubmit}
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
    borderColor: "#eeeeee",
    height: 50,
    paddingLeft: 5
  },
  footer: {
    height: 50
  }
});
