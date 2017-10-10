import React from 'react'
import { StyleSheet, Text, SectionList } from 'react-native'
import {List, ListItem, Left, Body, Right, Thumbnail, Container, Fab } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ModalCreateChannel from './ModalCreateChannel'
import NotificationUnread from './NotificationUnread'
import defaultStyles from '../styles'

export default class ChannelList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false
    }
  }

  _openModal = () => {
    this.setState({modalOpen: true})
  }

  _closeModal = () => {
    this.setState({modalOpen: false})
  }

  _onSubmitChannel = (channelName) => {
    this.props.onSubmitChannel(channelName)
    this.setState({modalOpen: false})
  }

  _renderChannel = (item) => {
    let image

    if (item.type === 'private') {
      image = <Thumbnail style={styles.avatar} source={{uri: item.icon}} />
    } else {
      image = <Icon style={styles.icon} name={item.icon.replace('_', '-')} />
    }

    return <ListItem avatar onPress={() => this.props.onSelectChannel(item.id, item.label)} style={styles.item}>
      <Left>
        {image}
      </Left>
      <Body>
        <Text style={styles.itemText}>{item.label}</Text>
      </Body>
      <Right>
        <NotificationUnread data={item}/>
      </Right>
    </ListItem>
  }

  render() {
    return (
      <Container style={styles.container}>
        <SectionList
          sections={[
            {title: 'DISCUSSIONS', data: [...this.props.channels]},
            {title: 'PRIVATE MESSAGES', data: [...this.props.privateChannels]},
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => this._renderChannel(item)}
          renderSectionHeader={({section}) => <ListItem itemHeader style={styles.headerList}><Text style={styles.headerListText}>{section.title}</Text></ListItem>}
        />

        <Fab
          active={true}
          style={styles.fab}
          position="bottomRight"
          onPress={() => this._openModal()}>
          <Icon name="add" />
        </Fab>

        <ModalCreateChannel
          modalChannelOpen={this.state.modalOpen}
          onSubmitChannel={this._onSubmitChannel}
          closeModal={this._closeModal}/>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: defaultStyles.primaryBackgroundColor
  },
  headerList: {
    paddingBottom: 15
  },
  headerListText: {
    fontSize: 18,
    color: defaultStyles.ligtherTextColor
  },
  item: {
    marginLeft: 0,
    paddingLeft: 10,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  itemText: {
    color: defaultStyles.primaryTextColor,
    fontSize: 18
  },
  avatar: {
    height: 20,
    width: 20
  },
  icon: {
    color: defaultStyles.ligtherTextColor,
    fontSize: 18
  },
  separator: {

  },
  notification: {
    color: '#cc273c'
  },
  createChannel: {
  },
  createChannelText: {
    fontSize: 18,
    paddingLeft: 5,
    color: defaultStyles.ligtherTextColor
  },
  iconCreateChannel: {
    fontSize: 18
  },
  modalCreate: {
    backgroundColor: defaultStyles.primaryBackgroundColor,
    flex: 1
  },
  modalCreateHeader: {
    fontSize: 40,
    paddingTop: 20,
    textAlign: 'center',
    color: '#fff'
  },
  fab: {
    backgroundColor: defaultStyles.prymaryColor
  }
});
