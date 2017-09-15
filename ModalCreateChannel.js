import React from 'react'
import { Modal, TextInput, View, StyleSheet, Text, Button } from 'react-native'

export default class ModalCreateChannel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={false}
        onRequestClose={() => {}}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.header}>New Channel</Text>
          </View>
          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              onSubmitEditing={this._onSubmit}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.buttons}>
            <Button style={styles.button} onPress={() => {}} title="Create"></Button>
            <Button style={styles.button} onPress={() => {}} title="Cancel"></Button>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#424242',
    flex: 1
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  header: {
    fontSize: 40,
    paddingTop: 20,
    textAlign: 'center',
    color: '#fff'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1
  }
});
