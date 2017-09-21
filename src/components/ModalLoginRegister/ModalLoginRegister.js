import React from 'react'
import { Modal, StyleSheet, Image } from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'
import Login from './Login'
import Register from './Register'

const background = require('../../../assets/background.jpeg')

export default class ModalLoginRegister extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: 'Login' },
        { key: '2', title: 'Register' },
      ]
    }
  }

  _handleIndexChange = index => this.setState({ index })

  _renderHeader = props => <TabBar {...props} />

  _renderScene = SceneMap({
    '1': Login,
    '2': Register,
  })

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={false}
        onRequestClose={() => {}}
      >
        <Image
          style={[styles.background, styles.container]}
          source={background}
          resizeMode="cover"
        >
          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onIndexChange={this._handleIndexChange}
          />
        </Image>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: null,
    height: null
  }
});
