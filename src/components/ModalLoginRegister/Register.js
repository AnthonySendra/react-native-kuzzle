import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import ButtonsModal from '../ButtonsModal'

export default class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      nickname: '',
      password: '',
      passwordConfirmation: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
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
              placeholder="Nickname"
              onChangeText={nickname => this.setState({nickname})}
              value={this.state.nickname}
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
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Password confirmation"
              onChangeText={passwordConfirmation => this.setState({passwordConfirmation})}
              value={this.state.passwordConfirmation}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        <ButtonsModal
          onAction={() => {}}
          actionLabel="REGISTER"
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
