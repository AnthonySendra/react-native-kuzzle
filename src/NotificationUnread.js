import React from 'react'
import { StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class NotificationUnread extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false
    }
  }

  render() {
    let icon = null 

    if (this.props.data.unread) {
      icon = <Icon style={styles.notification} name="fiber-manual-record"/>
    }

    return (
      <Text>
        {icon}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  notification: {
    color: '#cc273c'
  }
});
