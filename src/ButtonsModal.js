import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

export default class ButtonsModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={this.props.onSubmitChannel}>
          <Text style={styles.buttonTextCancel}>CREATE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.props.closeModal}>
          <Text style={styles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 80
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 0
  },
  buttonTextCancel: {
    textAlign: 'center',
    color: '#ff9800',
    fontSize: 20
  },
  buttonText: {
    textAlign: 'center',
    color: '#4caf50',
    fontSize: 20
  }
});
