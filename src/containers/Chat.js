import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Drawer, Input, Container, Content, Footer, FooterTab } from 'native-base'
import MessageList from '../components/MessageList'
import ChannelList from '../components/ChannelList'
import Header from '../components/Header'
import kuzzle from '../services/kuzzle'
import { listUsersByIds } from '../reducers/users'
import { selectChannel, listChannel, listPrivateChannel } from '../reducers/channels'
import defaultStyles from '../styles'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      messages: []
    }
  }

  componentWillUnmount() {
    kuzzle.resetSubscribe()
  }

  async componentDidMount() {
    await this._listMessages()
    kuzzle.subscribeMessages((err, result) => {
      console.log(result.document.content.channel, this.props.currentChannel.id)
      if (result.document.content.channel === this.props.currentChannel.id) {
        this.setState({
          messages: [...this.state.messages, {
            ...result.document.content,
            ...this.props.users[result.document.content.userId]
          }]
        })
      }
    })
  }

  _listMessages = async () => {
    try {
      const result = await kuzzle.listLastMessages(this.props.currentChannel.id)
      const messages = []
      result.getDocuments().reverse().forEach((document) => {
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

  _onSubmitMessage = async () => {
    const message = {
      userId: this.props.currentUser.id,
      content: this.state.message,
      timestamp: Date.now(),
      channel: this.props.currentChannel.id
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
    this.props.store.dispatch(selectChannel({id, label}))

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
            channels={this.props.channels}
            privateChannels={this.props.privateChannels}
            onSubmitChannel={this._onSubmitChannel}
            onSelectChannel={this._onSelectChannel} />
          }
        >

          <Header showMenu={this._showMenu} channel={this.props.currentChannel.label}/>

          <Container>
            <MessageList
              data={this.state.messages}>
            </MessageList>
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
    channels: listChannel(state.channels),
    privateChannels: listPrivateChannel(state.channels, state.users.current.id, listUsersByIds(state.users)),
    currentChannel: state.channels.current
  }
}

export default connect(mapStateToProps)(Chat)
