import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Container, Content, Thumbnail, Text, Body, Form, Item, Input, Label, View, Toast, Root } from 'native-base'
import defaultStyles from '../styles'
import kuzzle from '../services/kuzzle'
import {updateCurrentUser} from '../reducers/users'

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nickname: null,
      ido: null
    }
  }

  componentDidMount() {
    this.setState({
      nickname: this.props.currentUser.nickname,
      ido: this.props.currentUser.ido
    })
  }

  _save = async () => {
    try {
      this.props.store.dispatch(updateCurrentUser(this.state))

      await kuzzle.updateCurrentUser()
      Toast.show({
        text: 'Your modifications were saved successfully!',
        position: 'top',
        buttonText: 'close',
        type: 'success',
        duration: 3000
      })
    } catch (err) {
      Toast.show({
        text: 'Something went wrong...',
        position: 'top',
        buttonText: 'close',
        type: 'danger',
        duration: 3000
      })
    }
  }

  render() {
    return (
      <Root>
        <Container style={styles.container}>
          <Content>
            <Body style={styles.userInfo}>
              <Thumbnail source={{uri: this.props.currentUser.avatar}} style={styles.thumbnail}/>
              <Text style={styles.id}>{this.props.currentUser.id}</Text>
            </Body>

            <Form>
              <Item floatingLabel>
                <Label>Nickname</Label>
                <Input
                  value={this.state.nickname}
                  onChangeText={nickname => this.setState({nickname})}
                />
              </Item>
              <Item floatingLabel last>
                <Label>What I do</Label>
                <Input
                  value={this.state.ido}
                  onChangeText={ido => this.setState({ido})}
                />
              </Item>
            </Form>
          </Content>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={() => this._save()}>
              <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  id: {
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
  }
});

function mapStateToProps(state) {
  return {
    currentUser: state.users.current
  }
}

export default connect(mapStateToProps)(Settings)
