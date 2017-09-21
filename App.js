import React from 'react'
import { Container, Header } from 'native-base'
import { StyleSheet, View, StatusBar, KeyboardAvoidingView } from 'react-native'
import { Font, AppLoading } from 'expo'
import {Scene, Router} from 'react-native-router-flux'
import Chat from './src/pages/Chat'
import Users from './src/pages/Users'
import Settings from './src/pages/Settings'
import MenuTabs from './src/components/MenuTabs'
import ModalLoginRegister from './src/components/ModalLoginRegister/ModalLoginRegister'
import store from './src/store'

const currentUser = 'asendra@kaliop.com'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appIsReady: false
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    })

    this.setState({appIsReady: true})
  }

  render() {
    if (!this.state.appIsReady) {
      return <AppLoading />
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.statusBar} />

        <ModalLoginRegister />

        <MenuTabs />

        <Router>
          <Scene key="root">
            <Scene key="chat" component={Chat} title="chat" hideNavBar initial={true} />
            <Scene key="users" component={Users} title="users" hideNavBar users={store.getState().users}/>
            <Scene key="settings" component={Settings} title="settings" hideNavBar/>
          </Scene>
        </Router>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: StatusBar.currentHeight,
  }
})