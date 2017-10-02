import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Container, List, ListItem, Left, Body, Thumbnail, Text } from 'native-base'
import defaultStyles from '../styles'
import {listUsers} from '../reducers/users'
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

  _bump = () => {
    kuzzle.bump('asendra@kaliop.com', this.state.selectedUser.id)
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
          </ListItem>
        }>
        </List>

        <ModalUserDetail
          visible={this.state.modalUserDetailOpen}
          closeModal={this._closeModal}
          bump={this._bump}
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
    users: listUsers(state)
  }
}

export default connect(mapStateToProps)(Users)