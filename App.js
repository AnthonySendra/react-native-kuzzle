import React from 'react'
import { StyleSheet, Text, View, FlatList, TextInput, KeyboardAvoidingView, Button } from 'react-native'
import Drawer from 'react-native-drawer'
import Kuzzle from 'kuzzle-sdk/dist/kuzzle.js'

const kuzzle = new Kuzzle('192.168.1.63', {defaultIndex: 'slack'}, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected!');
  }
})
const messagesCollection = kuzzle.collection('messages')
let room

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      messages: []
    }
  }
  componentWillMount() {
    messagesCollection.search({}, {
      from: 0,
      to: 1000
    }, (err, result) => {
      let messages = []
      result.getDocuments().forEach(function(document) {
        messages.push(document.content.message)
      })

      this.setState({messages})
    })

    messagesCollection
      .subscribe({}, {subscribeToSelf: false, scope: 'in'}, (error, result) => {
        this.setState({messages: [...this.state.messages, result.document.content.message]})
      })
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return;
        }
        room = roomObject
      })
  }

  _onSubmit = (event) => {
    messagesCollection
      .createDocument({message: this.state.message}, (err, res) => {
        if (err) {
          console.error(err)
          return
        }
        this.setState({message: '', messages: [...this.state.messages, this.state.message]})
      })
  }

  _showMenu = () => {
    this._drawer.open()
  }

  componentWillUnmount() {
    room.unsubscribe()
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Drawer
          type="static"
          tweenHandler={Drawer.tweenPresets.parallax}
          ref={(ref) => this._drawer = ref}
          tapToClose={true}
          openDrawerOffset={100}
          content={<Text>Yolo</Text>}
        >
          <View style={styles.header}>
            <Button title="Test" onPress={this._showMenu} style={styles.headerButton}/>
            <Text style={styles.headerText}>Chanel BLABLA</Text>
          </View>
          <View style={styles.containerList}>
            <FlatList
              data={this.state.messages}
              renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
              keyExtractor={(item, index) => index}
            />
          </View>
          <View style={styles.footer}>
            <TextInput
              style={styles.input}
              placeholder="Write your message"
              onSubmitEditing={this._onSubmit}
              onChangeText={message => this.setState({message})}
              value={this.state.message}
              underlineColorAndroid="transparent"
            />
          </View>
        </Drawer>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: 'black',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20
  },
  headerButton: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingTop: 22
  },
  containerList: {
    flex: 1
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  input: {
    borderTopWidth: 2,
    borderColor: "#eeeeee",
    height: 50,
    paddingLeft: 5
  },
  footer: {
    height: 50
  }
});
