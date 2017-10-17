import React from 'react'
import { Container, Header } from 'native-base'
import { StyleSheet, View, StatusBar, KeyboardAvoidingView, Alert, Vibration } from 'react-native'
import { Font, AppLoading } from 'expo'
import {Scene, Router, Reducer} from 'react-native-router-flux'
import Chat from './src/containers/Chat'
import Users from './src/containers/Users'
import Settings from './src/containers/Settings'
import MenuTabs from './src/containers/MenuTabs'
import ModalLoginRegister from './src/components/ModalLoginRegister/ModalLoginRegister'
import kuzzle from './src/services/kuzzle'
import position from './src/services/position'
import store from './src/store'
import {listUsersByIds} from './src/reducers/users'
import {changeFocus} from './src/reducers/routes'
import { Provider } from 'react-redux'

const routerReducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    store.dispatch(changeFocus(action.type, action.routeName))
    return defaultReducer(state, action)
  }
}

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
    kuzzle.subscribeChannels()
    kuzzle.subscribeAllMessages()

    kuzzle.subscribeUsers()
    this._subscribeBump()

    await position.checkRights()
    position.subscribe()

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
      <Provider store={store}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding">

          <View style={styles.statusBar} />

          <ModalLoginRegister />

          <Router createReducer={routerReducerCreate}>
            <Scene key="root">
              <Scene
                key="chat"
                component={Chat}
                title="chat"
                hideNavBar
                initial={true}
              />
              <Scene
                key="users"
                component={Users}
                title="users"
                hideNavBar
              />
              <Scene
                key="settings"
                component={Settings}
                title="settings"
                hideNavBar
              />
            </Scene>
          </Router>

          <MenuTabs  />
        </KeyboardAvoidingView>
      </Provider>
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