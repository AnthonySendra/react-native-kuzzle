import React from 'react'
import { StyleSheet, Keyboard } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Badge } from 'native-base'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

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

  componentWillUpdate() {
  }

  render() {
    if (!this.state.displayMenu) {
      return (null)
    }

    const {routes} = this.context
    console.log(routes)

    return (
      <Footer>
        <FooterTab>
          <Button vertical onPress={() => {Actions.chat()}} active={this.props.routes.scene.title === 'chat'}>
            {/*<Badge><Text>2</Text></Badge>*/}
            <Icon name="chatboxes" />
            <Text>{this.props.routes.scene.title}</Text>
          </Button>
          <Button vertical onPress={() => {Actions.users()}} active={this.props.routes.scene.title === 'users'}>
            <Icon name="contact" />
            <Text>Users</Text>
          </Button>
          <Button vertical onPress={() => {Actions.settings()}} active={this.props.routes.scene.title === 'settings'}>
            <Icon name="settings"/>
            <Text>Settings</Text>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
}

const styles = StyleSheet.create({
});

export default connect(({routes}) => ({routes}))(MenuTabs)
