import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import {Actions} from 'react-native-router-flux'
import { Container, List, ListItem, Left, Body, Thumbnail, Text, Right, Icon } from 'native-base'
import defaultStyles from '../styles'
import {listUsers, listUsersByIds} from '../reducers/users'
import {listPrivateChannel, selectChannel} from '../reducers/channels'
import ModalUserDetail from '../components/ModalUserDetail'
import kuzzle from '../services/kuzzle'

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalUserDetailOpen: false,
      selectedUser: {}
    }
  }

  _closeModal = () => {
    this.setState({modalUserDetailOpen: false})
  }

  _showUser = (user) => {
    this.setState({
      selectedUser: {...user},
      modalUserDetailOpen: true
    })
  }

  _chat = async () => {
    const channels = this.props.privateChannels
      .filter(channel => channel.label === this.state.selectedUser.nickname)
    let channel = channels.length ? channels[0] : null

    if (!channel) {
      const result = await kuzzle.createChannel('', this.state.selectedUser.id)
      channel = {
        ...result.content,
        id: result.id,
        label: this.state.selectedUser.nickname
      }
    }

    this.props.store.dispatch(selectChannel(channel))
    Actions.chat()
    this.setState({modalUserDetailOpen: false})
  }

  _bump = () => {
    kuzzle.bump(this.state.selectedUser.id)
  }

  _userStatus = (item) => {
    if (item.lastActive && Date.now() - item.lastActive <= 60000) {
      return <Icon name="radio-button-on" style={{color: 'green'}}/>
    }

    return <Icon name="radio-button-off" style={{color: 'red'}}/>
  }

  render() {
    return (
      <Container>
        <List
          dataArray={this.props.users}
          renderRow={(item) =>
          <ListItem avatar onPress={() => this._showUser(item)} style={styles.listItem}>
            <Left>
              <Thumbnail source={{uri: item.avatar}} style={styles.thumbnail}/>
            </Left>
            <Body>
              <Text style={styles.nickname}>{item.nickname}</Text>
              <Text style={styles.email} note>{item.id}</Text>
            </Body>
            <Right>
              {this._userStatus(item)}
            </Right>
          </ListItem>
        }>
        </List>

        <ModalUserDetail
          visible={this.state.modalUserDetailOpen}
          closeModal={this._closeModal}
          bump={this._bump}
          chat={this._chat}
          user={this.state.selectedUser} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    marginLeft: 0
  },
  thumbnail: {
    marginLeft: 10,
    width: 40,
    height: 40
  },
  nickname: {
    color: defaultStyles.primaryTextColor
  },
  email: {
    color: defaultStyles.ligtherTextColor
  }
});

function mapStateToProps(state) {
  return {
    users: listUsers(state.users),
    privateChannels: listPrivateChannel(state.channels, state.users.current.id, listUsersByIds(state.users)),
  }
}

export default connect(mapStateToProps)(Users)