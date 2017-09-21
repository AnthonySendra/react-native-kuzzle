import React from 'react'
import { StyleSheet } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Badge } from 'native-base'
import { Actions } from 'react-native-router-flux'


export default class MenuTabs extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Footer>
        <FooterTab>
          <Button vertical onPress={() => {Actions.chat()}}>
            {/*<Badge><Text>2</Text></Badge>*/}
            <Icon name="chatboxes" />
            <Text>Chat</Text>
          </Button>
          <Button vertical onPress={() => {Actions.users()}}>
            <Icon name="contact" />
            <Text>Users</Text>
          </Button>
          <Button vertical onPress={() => {Actions.settings()}}>
            <Icon name="settings"/>
            <Text>Settings</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

const styles = StyleSheet.create({
});
