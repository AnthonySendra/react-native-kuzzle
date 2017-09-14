import React from 'react'
import { StyleSheet, Text, View, FlatList, TextInput, KeyboardAvoidingView, Button } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
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
  componentDidMount() {
    messagesCollection.search({}, {
      from: 0,
      size: 1000
    }, (err, result) => {
      let messages = []
      result.getDocuments().forEach(function(document) {
        messages.push(document.content.message)
      })

      this.setState({messages})
      setTimeout(() => {
        this._flatList.scrollToEnd();
      }, 100)
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
        this._flatList.scrollToIndex({
          index: this.state.messages.length - 1,
          animated: true
        });
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
            <Icon name="menu" size={30} color="#4F8EF7" onPress={this._showMenu} />
            <Text style={styles.headerText}>Chanel BLABLA</Text>
          </View>
          <View style={styles.containerList}>
            <FlatList
              ref={(ref) => this._flatList = ref}
              data={this.state.messages}
              renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
              keyExtractor={(item, index) => index}
              getItemLayout={(data, index) => ({ length: 44, offset: 44 * index, index })}
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
    backgroundColor: 'black',
    flex: 0,
    height: 60,
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headerText: {
    height: 60,
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    paddingTop: 15
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
