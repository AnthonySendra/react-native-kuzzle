import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import defaultStyles from '../styles'

export default class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.header}>
        <Icon name="menu" size={30} color="#fff" onPress={this.props.showMenu} style={styles.headerButton} />
        <Text style={styles.headerText}>Channel {this.props.channel}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: defaultStyles.prymaryColor,
    flex: 0,
    height: 50,
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headerButton: {
    marginLeft: 10
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
});
