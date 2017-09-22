import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, TextInput, Vibration, Alert} from 'react-native'
import { Drawer, Container, Content, Footer, FooterTab } from 'native-base'
import MessageList from '../components/MessageList'
import ChannelList from '../components/ChannelList'
import Header from '../components/Header'
import kuzzle from '../services/kuzzle'
import { listUsersByIds } from '../reducers/users'
import defaultStyles from '../styles'

const currentUser = 'asendra@kaliop.com'

class Chat extends React.Component {
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
    kuzzle.resetSubscribe()
  }

  async componentDidMount() {
    this._subscribeBump()
    await this._listChannels()
    await this._listMessages()
    this._subscribeMessages()
    this._subscribeChannels()
  }

  _subscribeBump = () => {
    kuzzle.subscribeBump(currentUser, (error, result) => {
      Vibration.vibrate(200, true)
      Alert.alert(
        'Bumped!',
        `${this.state.users[result.document.content.userId].nickname} bumped you`,
        [
          {text: `I'm not a kid, cancel`, onPress: () => {}},
          {text: 'Bump back!', onPress: () => kuzzle.bump(currentUser, result.document.content.userId)}
        ],
        { cancelable: true })
    })
  }

  _subscribeMessages = () => {
    kuzzle.subscribeMessages((error, result) => {
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
  }

  _subscribeChannels = () => {
    kuzzle.subscribeChannels((error, result) => {
      this.setState({
        channels: [...this.state.channels, {
          id: result.document.id,
          label: result.document.content.label,
          icon: result.document.content.icon.replace('default', 'forum'),
          unread: false
        }]
      })
    })
  }

  _listMessages = async () => {
    try {
      const result = await kuzzle.listMessages(this.state.channel)
      const messages = []
      result.getDocuments().forEach((document) => {
        messages.push({
          ...document.content,
          ...this.props.users[document.content.userId]
        })
      })

      this.setState({messages})
    } catch (err) {
      console.error(err)
    }
  }

  _listChannels = async () => {
    try {
      const result = await kuzzle.listChannels()
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
      await kuzzle.createMessage(message)
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
      await kuzzle.createChannel(id, channel)
      this.setState({channels: [...this.state.channels, {...channel, id}]})
    } catch (err) {
      console.error(err)
    }
  }

  _showMenu = () => {
    this.drawer._root.open()
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
      this.drawer._root.close()
    }, 0)
  }

  render() {
    return (
      <Container>

        <Drawer
          ref={(ref) => this.drawer = ref}
          content={<ChannelList
            data={this.state.channels}
            onSubmitChannel={this._onSubmitChannel}
            onSelectChannel={this._onSelectChannel} />
          }
        >

          <Header showMenu={this._showMenu} channel={this.state.channel}/>

          <Container>
            <MessageList
              ref={(ref) => this._messageList = ref}
              data={this.state.messages}>
            </MessageList>
          </Container>

          <Footer style={styles.footer}>
            <FooterTab style={styles.footer}>
              <TextInput
                style={styles.input}
                placeholder="Write your message"
                onSubmitEditing={this._onSubmitMessage}
                onChangeText={message => this.setState({message})}
                value={this.state.message}
                underlineColorAndroid="transparent"
              />
            </FooterTab>
          </Footer>
        </Drawer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    color: '#fff',
    width: '100%'
  },
  footer: {
    borderColor: '#424242',
    backgroundColor: defaultStyles.backgroundColor,
    height: 50,
    paddingLeft: 10
  }
})

function mapStateToProps(state) {
  return {
    users: listUsersByIds(state)
  }
}

export default connect(mapStateToProps)(Chat)
