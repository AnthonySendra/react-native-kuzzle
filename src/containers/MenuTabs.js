import React from 'react'
import { Keyboard } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Badge } from 'native-base'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import {isChannelUnread} from '../reducers/channels'

class MenuTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displayMenu: true
    }
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', () => this.setState({displayMenu: false}))
    Keyboard.addListener('keyboardDidHide', () => this.setState({displayMenu: true}))
  }

  render() {
    if (!this.state.displayMenu) {
      return (null)
    }

    return (
      <Footer>
        <FooterTab>
          <Button badge={this.props.isChannelUnread} vertical onPress={() => {Actions.chat()}} active={this.props.routes.currentScene === 'chat'}>
            {this.props.isChannelUnread &&
              <Badge><Text>!</Text></Badge>
            }
            <Icon name="chatboxes" />
            <Text>Chat</Text>
          </Button>
          <Button vertical onPress={() => {Actions.users()}} active={this.props.routes.currentScene === 'users'}>
            <Icon name="contact" />
            <Text>Users</Text>
          </Button>
          <Button vertical onPress={() => {Actions.settings()}} active={this.props.routes.currentScene === 'settings'}>
            <Icon name="settings"/>
            <Text>Settings</Text>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
}

function mapStateToProps(state) {
  return {
    routes: state.routes,
    isChannelUnread: isChannelUnread(state.channels)
  }
}

export default connect(mapStateToProps)(MenuTabs)

