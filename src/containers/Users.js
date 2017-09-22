import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base'
import defaultStyles from '../styles'

const currentUser = 'asendra@kaliop.com'

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
        <List
          dataArray={this.props.users}
          renderRow={(item) =>
          <ListItem  avatar style={styles.listItem}>
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
    users: state.users
  }
}

export default connect(mapStateToProps)(Users)