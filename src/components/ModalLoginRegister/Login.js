import React from 'react'
import { View, StyleSheet, TextInput, Image } from 'react-native'
import ButtonsModal from '../ButtonsModal'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  _login = () => {

  }

  render() {
    return (
      <View>
        <View style={styles.content}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={email => this.setState({email})}
              value={this.state.email}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={password => this.setState({password})}
              value={this.state.password}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        <ButtonsModal
          onAction={() => {}}
          actionLabel="LOGIN"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: 15
  },
  inputWrap: {
    flexDirection: "row",
    marginVertical: 10,
    height: 40,
    backgroundColor: "transparent"
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#FFF'
  }
});
