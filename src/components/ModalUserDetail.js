import React from 'react'
import { StyleSheet, Modal, TouchableOpacity } from 'react-native'
import { Container, Header, Content, Thumbnail, Left, Text, Body, Card, CardItem, View, Right } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import defaultStyles from '../styles'

export default class ModalUserDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let
      ido

    if (this.props.user.ido) {
      ido = <Card style={styles.card}>
        <CardItem>
          <Body>
          <Text style={styles.quote}>{this.props.user.ido}</Text>
          </Body>
        </CardItem>
      </Card>
    }

    return (
      <Container>
        <Modal
          visible={this.props.visible}
          transparent={false}
          animationType="slide"
          onRequestClose={() => {}}>
          <Container>
            <Content>
              <Header style={styles.header}>
                <Left>
                  <TouchableOpacity onPress={this.props.closeModal}>
                    <Icon name="clear" style={styles.cancel}/>
                  </TouchableOpacity>
                </Left>
                <Body>
                  <Text style={styles.headerText}>{this.props.user.nickname}</Text>
                </Body>
              </Header>

              <Body style={styles.userInfo}>
                <Thumbnail source={{uri: this.props.user.avatar}} style={styles.thumbnail}/>
                <Text style={styles.nickname}>{this.props.user.nickname}</Text>
                <Text style={styles.id}>{this.props.user.id}</Text>
              </Body>

              {ido}
            </Content>

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>CHAT <Icon style={styles.icon} name="chat" /></Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={this.props.bump}>
                <Text style={[styles.buttonText, styles.buttonTextWarning]}>BUMP! <Icon style={styles.icon} name="notifications-active" /></Text>
              </TouchableOpacity>
            </View>
          </Container>
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: defaultStyles.prymaryColor,
    height: 70
  },
  cancel: {
    fontSize: 20
  },
  headerText: {
    color: '#fff',
    fontSize: 30
  },
  nickname: {
    color: defaultStyles.primaryTextColor,
    fontSize: 30
  },
  userInfo: {
    marginTop: 20,
    marginBottom: 20
  },
  thumbnail: {
    width: 60,
    height: 60
  },
  headerSubtitle: {
    fontSize: 15,
    color: defaultStyles.primaryTextColor
  },
  card: {
    marginTop: 20
  },
  quote: {
    borderLeftWidth: 5,
    borderColor: '#1976d2',
    fontSize: 30,
    fontStyle: 'italic',
    paddingLeft: 20,
    fontWeight: '100'
  },
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
  buttonText: {
    textAlign: 'center',
    color: '#4caf50',
    fontSize: 20
  },
  buttonTextWarning: {
    color: 'red'
  },
  icon: {
    fontSize: 20
  }
});