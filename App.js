import React from 'react'
import { Container, Header } from 'native-base'
import { StyleSheet, View, StatusBar, KeyboardAvoidingView, Alert, Vibration } from 'react-native'
import { Font, AppLoading } from 'expo'
import {Scene, Router} from 'react-native-router-flux'
import Chat from './src/containers/Chat'
import Users from './src/containers/Users'
import Settings from './src/containers/Settings'
import MenuTabs from './src/components/MenuTabs'
import ModalLoginRegister from './src/components/ModalLoginRegister/ModalLoginRegister'
import kuzzle from './src/services/kuzzle'
import store from './src/store'
import {listUsersByIds} from './src/reducers/users'

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
    await kuzzle.listUsers()
    await kuzzle.listChannels()
    await kuzzle.listPrivateChannels()
    await kuzzle.subscribeMessages()

    kuzzle.subscribeUsers()
    this._subscribeBump()

    this.setState({appIsReady: true})
  }

  _subscribeBump = () => {
    const users = listUsersByIds(store.getState().users)

    kuzzle.subscribeBump((error, result) => {
      Vibration.vibrate(200, true)
      Alert.alert(
        'Bumped!',
        `${users[result.document.content.userId].nickname} bumped you`,
        [
          {text: `I'm not a kid, cancel`, onPress: () => {}},
          {text: 'Bump back!', onPress: () => kuzzle.bump(result.document.content.userId, true)}
        ],
        { cancelable: true })
    })
  }

  render() {
    if (!this.state.appIsReady) {
      return <AppLoading />
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.statusBar} />

        <ModalLoginRegister />

        <Router>
          <Scene key="root">
            <Scene
              key="chat"
              component={Chat}
              title="chat"
              hideNavBar
              initial={true}
              store={store}
            />
            <Scene
              key="users"
              component={Users}
              title="users"
              hideNavBar
              store={store}
            />
            <Scene
              key="settings"
              component={Settings}
              title="settings"
              hideNavBar
              store={store}
            />
          </Scene>
        </Router>

        <MenuTabs />
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height: StatusBar.currentHeight,
  }
})