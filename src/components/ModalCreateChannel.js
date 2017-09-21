import React from 'react'
import { Modal, TextInput, View, StyleSheet, Text } from 'react-native'
import ButtonsModal from './ButtonsModal'

export default class ModalCreateChannel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      channelName: ''
    }
  }

  _onSubmitChannel = () => {
    this.props.onSubmitChannel(this.state.channelName)
    this.setState({channelName: ''})
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalChannelOpen}
        onRequestClose={() => {}}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.header}>New Channel</Text>
          </View>
          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder="Channel name"
              onSubmitEditing={this._onSubmitChannel}
              underlineColorAndroid="transparent"
              onChangeText={channelName => this.setState({channelName})}
              value={this.state.channelName}
            />
          </View>
          <ButtonsModal
            onAction={this._onSubmitChannel}
            actionLabel="CREATE"
            onCancel={this.props.closeModal}
            cancelLabel="CANCEL"
          />
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
    flex: 1
  },
  header: {
    fontSize: 40,
    paddingTop: 20,
    textAlign: 'center',
    color: '#fff'
  },
  input: {
    flex: 1,
    fontSize: 40,
    paddingLeft: 20,
    color: '#fff'
  }
});
