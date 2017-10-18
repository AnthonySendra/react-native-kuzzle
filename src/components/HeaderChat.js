import React from 'react'
import { StyleSheet} from 'react-native'
import {Text, Body, Left, Right, Icon, Button, Header, Item, Input} from 'native-base'
import defaultStyles from '../styles'

export default class HeaderChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSearch: false
    }
  }

  _displaySearch = () => {
    this.setState({isSearch: true})
    setTimeout(() => {
      this.searchInput._root.focus()
    }, 0)
  }

  _normalDisplay = () => {
    return (
      <Header style={styles.header}>
        <Left>
          <Button transparent onPress={() => {this.props.showMenu()}}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
        <Text style={styles.headerText}>{this.props.channel}</Text>
        </Body>
        <Right>
          <Button transparent onPress={() => {this._displaySearch()}}>
            <Icon name="search" />
          </Button>
        </Right>
      </Header>
    )
  }

  _searchDisplay = () => {
    return (
      <Header style={styles.header} searchBar={true}>
        <Item>
          <Icon name="search" />
          <Input placeholder="Search" ref={(ref) => {this.searchInput = ref}}/>
          <Button transparent onPress={() => {this.setState({isSearch: false})}}>
            <Icon name="close" />
          </Button>
        </Item>
      </Header>
    )
  }

  render() {
    if (this.state.isSearch) {
      return this._searchDisplay()
    }

    return this._normalDisplay()
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: defaultStyles.prymaryColor
  },
  headerText: {
    color: '#fff',
    fontSize: 20
  },
  itemSearch: {
    width: '100%',
  },
  input: {
    color: '#fff'
  }
});
