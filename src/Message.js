import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'

export default class Message extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={{uri: this.props.data.avatar}} />
        <View style={styles.containerMessage}>
          <Text style={styles.user}>{this.props.data.nickname}</Text>
          <Text style={styles.message}>{this.props.data.content}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  containerMessage: {
    flex: 1,
    justifyContent: 'center'
  },
  message: {
    paddingLeft: 10,
    paddingBottom: 10,
    fontSize: 18,
    color: '#dcdcdc'
  },
  user: {
    color: '#fff',
    fontSize: 20,
    paddingLeft: 10
  },
  image: {
    paddingLeft: 10,
    height: 30,
    width: 30
  }
});
