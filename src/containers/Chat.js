import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Drawer, Input, Container, Content, Footer, FooterTab, Header, Left, Body, Right, Button, Icon } from 'native-base'
import MessagesList from '../components/MessagesList'
import MessagesMap from '../components/MessagesMap'
import ChannelList from '../components/ChannelList'
import HeaderChat from '../components/HeaderChat'
import kuzzle from '../services/kuzzle'
import { listUsersByIds } from '../reducers/users'
import { selectChannel, listChannel, listPrivateChannel, setChannelUnread } from '../reducers/channels'
import defaultStyles from '../styles'
import store from '../store'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      messages: [],
      from: 0,
      size: 10
    }
  }

  async componentDidUpdate() {
    kuzzle.subscribeChannelMessages(this.props.currentChannel.id, (err, result) => {
      this.setState({
        messages: [...this.state.messages, {
          ...result.document.content,
          ...this.props.users[result.document.content.userId],
          id: result.document.id
        }]
      })
    })
  }

  async componentDidMount() {
    await this._listMessages()
  }

  _listMessages = async (isRefresh) => {
    try {
      if (isRefresh) {
        await this.setState({from: this.state.from + this.state.size})
      }

      const result = await kuzzle.listLastMessages(this.props.currentChannel.id, this.state.from, this.state.size)
      const messages = []
      result.getDocuments().reverse().forEach((document) => {
        messages.push({
          ...document.content,
          ...this.props.users[document.content.userId],
          id: document.id
        })
      })

      if (isRefresh) {
        this.setState({messages: [...messages, ...this.state.messages]})
      } else {
        this.setState({messages})
      }
    } catch (err) {
      console.error(err)
    }
  }

  _onSubmitMessage = async () => {
    const message = {
      userId: this.props.currentUser.id,
      content: this.state.message,
      timestamp: Date.now(),
      channel: this.props.currentChannel.id
    }

    if (this.props.currentChannel.id === '#geo') {
      message.location = {
        lat: this.props.userLocation.latitude,
        lon: this.props.userLocation.longitude
      }
    }

    try {
      await kuzzle.createMessage(message)
      this.setState({message: ''})
    } catch (err) {
      console.error(err)
    }
  }

  _onSubmitChannel = async (label) => {
    try {
      await kuzzle.createChannel(label)
    } catch (err) {
      console.error(err)
    }
  }

  _showMenu = () => {
    this.drawer._root.open()
  }

  _onSelectChannel = (id, label) => {
    store.dispatch(selectChannel({id, label}))
    store.dispatch(setChannelUnread({id, unread: false}))

    setTimeout(async () => {
      await this._listMessages()
      this.drawer._root.close()
    }, 0)
  }

  _displayMessages = () => {
    if (this.props.currentChannel.id === '#geo') {
      return (<MessagesMap data={this.state.messages} userLocation={this.props.userLocation} />)
    }

    return (
      <MessagesList
        refresh={() => this._listMessages(true)}
        data={this.state.messages}>
      </MessagesList>
    )
  }

  render() {
    return (
      <Container>
        <Drawer
          ref={(ref) => this.drawer = ref}
          content={<ChannelList
            permissionLocation={this.props.permissionLocation}
            channels={this.props.channels}
            userLocation={this.props.userLocation}
            geoChannel={this.props.geoChannel}
            privateChannels={this.props.privateChannels}
            onSubmitChannel={this._onSubmitChannel}
            onSelectChannel={this._onSelectChannel} />
          }
        >

          <HeaderChat showMenu={this._showMenu} channel={this.props.currentChannel.label}/>

          <Container>
            {this._displayMessages()}
          </Container>

          <Footer style={styles.footer}>
            <FooterTab style={styles.footer}>
              <Input
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
  },
  footer: {
    backgroundColor: defaultStyles.primaryBackgroundColor,
    height: 50,
    paddingLeft: 10
  }
})

function mapStateToProps(state) {
  return {
    users: listUsersByIds(state.users),
    currentUser: state.users.current,
    permissionLocation: state.users.permissionLocation,
    userLocation: state.users.location,
    geoChannel: state.channels.geo,
    channels: listChannel(state.channels),
    privateChannels: listPrivateChannel(state.channels, state.users.current.id, listUsersByIds(state.users)),
    currentChannel: state.channels.current
  }
}

export default connect(mapStateToProps)(Chat)
