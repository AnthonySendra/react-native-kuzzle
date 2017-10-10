import React from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity } from 'react-native'
import {Container, Content, Header, Form, Item, Input, Body, Left, Label } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ButtonsModal from './ButtonsModal'
import defaultStyles from '../styles'

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
      <Container>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.modalChannelOpen}
          onRequestClose={() => {}}
        >
          <Container>
            <Content>
              <Header style={styles.header}>
                <Left>
                  <TouchableOpacity onPress={this.props.closeModal}>
                    <Icon name="clear" style={styles.cancel}/>
                  </TouchableOpacity>
                </Left>
                <Body>
                  <Text style={styles.headerText}>New Channel</Text>
                </Body>
              </Header>

              <Form>
                <Item floatingLabel>
                  <Label>Channel name</Label>
                  <Input
                    value={this.state.channelName}
                    onChangeText={channelName => this.setState({channelName})}
                  />
                </Item>
              </Form>
            </Content>

            <ButtonsModal
              onAction={this._onSubmitChannel}
              actionLabel="CREATE"
              onCancel={this.props.closeModal}
              cancelLabel="CANCEL"
              />
          </Container>
        </Modal>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: defaultStyles.prymaryColor,
    height: 70
  },
  headerText: {
    color: '#fff',
    fontSize: 30
  },
  input: {
  },
  cancel: {
    fontSize: 20
  }
});
