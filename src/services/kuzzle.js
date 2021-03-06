import Kuzzle from 'kuzzle-sdk/dist/kuzzle.js'
import store from '../store'
import {addUsers, updateUser} from '../reducers/users'
import {addChannels, addPrivateChannels, setChannelUnread} from '../reducers/channels'

Kuzzle.prototype.bluebird = require('bluebird')
const rooms = []
let roomChannelMessages

class KuzzleWrapper {
  constructor() {
    this.kuzzle = new Kuzzle('10.35.250.37', {defaultIndex: 'slam'}, (err, res) => {
      if (err) {
        console.error(err);
      }
      else {
        console.log('Connected!');
      }
    })
    this.messagesCollection = this.kuzzle.collection('slam-messages')
    this.usersCollection = this.kuzzle.collection('slam-users')
    this.channelsCollection = this.kuzzle.collection('slam')
  }

  subscribeBump(cb) {
    const currentUserId = store.getState().users.current.id
    const filter = {and: [{equals: {event: 'bump'}}, {equals: {bumping: currentUserId}}]}
    this.messagesCollection
      .subscribe(filter, {subscribeToSelf: false, scope: 'in'}, (err, result) => cb(err, result))
  }

  subscribeChannelMessages(channelId, cb) {
    const query = {
      and: [
        {
          equals: {
            channel: channelId
          }
        }
      ]
    }

    if (channelId === '#geo') {
      const location = {...store.getState().users.location}
      query.and.push({
        geoDistance: {
          location: {
            lat: location.latitude,
            lon: location.longitude
          },
          distance: '5m'
        }
      })
    }

    if (roomChannelMessages) {
      console.log('unsub')
      roomChannelMessages.unsubscribe()
    }

    this.messagesCollection
      .subscribe(query, {subscribeToSelf: true, scope: 'in'}, (err, result) => {
        if (result.document.content.event === 'bump') {
          return
        }
        if (result.document.content.event === 'typing') {
          return
        }

        cb(err, result)
      })
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return
        }

        roomChannelMessages = roomObject
      })
  }

  subscribeAllMessages() {
    this.messagesCollection
      .subscribe({}, {subscribeToSelf: true, scope: 'in'}, (err, result) => {
        if (result.document.content.event === 'bump') {
          return
        }
        if (result.document.content.event === 'typing') {
          return
        }
        if (store.getState().channels.current.id === result.document.content.channel) {
          return
        }

        store.dispatch(setChannelUnread({id: result.document.content.channel, unread: true}))
      })
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return
        }

        rooms.push(roomObject)
      })
  }

  subscribeChannels() {
    this.channelsCollection
      .subscribe({}, {subscribeToSelf: true, scope: 'in'}, (err, result) => storeChannels(result))
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return
        }

        rooms.push(roomObject)
      })
  }

  subscribeUsers() {
    this.usersCollection.subscribe({}, {scope: 'in'}, (err, result) => {
      if (result.action === 'create') {
        store.dispatch(addUsers([{...result.document.content, id: result.document.id}]))
      }
      if (result.action === 'update') {
        store.dispatch(updateUser({...result.document.content, id: result.document.id}))
      }
    })
  }

  bump(userId, back = false) {
    const currentUserId = store.getState().users.current.id
    this.messagesCollection.publishMessage({
      event: 'bump',
      userId: currentUserId,
      bumping: userId,
      back
    })
  }

  async listLastMessages(channelId, from, size) {
    const query = {
      query: {bool: {should: [{bool: {must: [{match_phrase_prefix: {channel: channelId.replace('#', '')}}]}}]}},
      sort: [{timestamp: 'desc'}]
    }

    const location = store.getState().users.location

    if (channelId === '#geo') {
      query.query.bool.filter = {
        geo_distance: {
          distance: '5m',
          location: {
            lat: location.latitude,
            lon: location.longitude
          }
        }
      }
    }

    return this.messagesCollection.searchPromise(query, {from, size})
  }

  async searchMessages(text) {
    const query = {
      query: {
        bool: {
          must: [
            {wildcard: {content: `*${text.toLowerCase()}*`}},
            {terms: {channel: store.getState().channels.list.map(c => c.id.replace('#', ''))}}
          ]
        }
      },
      sort: [{timestamp: 'desc'}]
    }

    return this.messagesCollection.searchPromise(query, {size: 100})
  }

  async listUsers() {
    const result = await this.usersCollection.searchPromise({sort: [{_uid: 'asc'}]}, {size: 100})
    const users = []

    result.getDocuments().forEach(function (document) {
      users.push({...document.content, id: document.id})
    })

    store.dispatch(addUsers(users))
  }

  async listChannels() {
    const query = {query: {terms: {type: ['public', 'restricted']}}}
    const result = await this.channelsCollection.searchPromise(query, {size: 100})
    const channels = []

    result.getDocuments().forEach(function (document) {
      channels.push({...document.content, id: document.id, unread: false})
    })

    store.dispatch(addChannels(channels))
  }

  async listPrivateChannels() {
    const query = {query: {bool: {should: [{bool: {must: [{match_phrase_prefix: {'users': store.getState().users.current.id}}, {match_phrase_prefix: {type: 'private'}}]}}]}}}

    const result = await this.channelsCollection.searchPromise(query)
    const privateChannels = []

    result.getDocuments().forEach(function (document) {
      privateChannels.push({...document.content, id: document.id, unread: false})
    })

    store.dispatch(addPrivateChannels(privateChannels))
  }

  async createMessage(message) {
    return this.messagesCollection.createDocumentPromise(message)
  }

  async createChannel(label, userId = null) {
    let id = null
    if (!userId) {
      id = '#' + label
    }

    const channel = {
      label,
      type: userId ? 'private' : 'public',
      icon: userId ? 'end2end' : 'forum'
    }

    if (userId) {
      channel.users = [store.getState().users.current.id, userId]
    }

    return await this.channelsCollection.createDocumentPromise(id, channel)
  }

  async updateCurrentUser() {
    const currentUser = {...store.getState().users.current}
    delete currentUser.id

    return this.usersCollection.updateDocument(store.getState().users.current.id, {...currentUser})
  }

  heartBeatStatus() {
    const heartBeat = () => {
      const currentUser = {...store.getState().users.current}
      delete currentUser.id
      currentUser.lastActive = Date.now()

      return this.usersCollection.updateDocument(store.getState().users.current.id, {...currentUser})
    }

    heartBeat()
    setInterval(heartBeat, 50000)
  }

  resetSubscribe() {
    rooms.forEach(room => room.unsubscribe())
  }
}

function storeChannels(result) {
  const channel = {
    ...result.document.content,
    id: result.document.id,
    unread: false
  }

  if (channel.type === 'private') {
    store.dispatch(addPrivateChannels([channel]))
  }
  else {
    store.dispatch(addChannels([channel]))
  }
}

export default new KuzzleWrapper()