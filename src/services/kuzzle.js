import Kuzzle from 'kuzzle-sdk/dist/kuzzle.js'
import store from '../store'
import {addUsers} from '../reducers/users'
import {addChannels, addPrivateChannels} from '../reducers/channels'

Kuzzle.prototype.bluebird = require('bluebird')
let rooms = []

class KuzzleWrapper {
  constructor () {
    this.kuzzle = new Kuzzle('10.34.50.59', {defaultIndex: 'foo'}, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Connected!');
      }
    })
    this.messagesCollection = this.kuzzle.collection('slack-messages')
    this.usersCollection = this.kuzzle.collection('slack-users')
    this.channelsCollection = this.kuzzle.collection('slack')
  }

  subscribeBump (cb) {
    const currentUserId = store.getState().users.current.id
    const filter = {and: [{equals: {event: 'bump'}}, {equals: {bumping: currentUserId}}]}
    this.messagesCollection
      .subscribe(filter, {subscribeToSelf: false, scope: 'in'}, (err, result) => cb(err, result))
  }

  subscribeMessages (cb) {
    this.messagesCollection
      .subscribe({}, {subscribeToSelf: true, scope: 'in'}, (err, result) => {
        if (result.document.content.event === 'bump') {
          return
        }
        if (result.document.content.event === 'typing') {
          return
        }

        if (cb) {
          cb(err, result)
        }
      })
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return;
        }
        rooms.push(roomObject)
      })
  }

  subscribeChannels () {
    this.channelsCollection
      .subscribe({}, {subscribeToSelf: true, scope: 'in'}, (err, result) => storeChannels(result))
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return;
        }

        rooms.push(roomObject)
      })
  }

  subscribeUsers () {
    this.usersCollection.subscribe({}, {scope: 'in'}, (err, result) => {
      store.dispatch(addUsers([{...result.document.content, id: result.document.id}]))
    })
  }

  bump (userId, back = false) {
    const currentUserId = store.getState().users.current.id
    this.messagesCollection.publishMessage({
      event: 'bump',
      userId: currentUserId,
      bumping: userId,
      back
    })
  }

  async listLastMessages (channel) {
    const query = {
      query: {bool:{should:[{bool:{must:[{match_phrase_prefix: {channel: channel.replace('#', '')}}]}}]}},
      sort: [{ timestamp: 'desc' }]
    }

    return this.messagesCollection.searchPromise(query, { size: 20 })
  }

  async listUsers () {
    const result = await this.usersCollection.searchPromise({sort: [{ _uid: 'asc' }]}, {})
    const users = []

    result.getDocuments().forEach(function(document) {
      users.push({...document.content, id: document.id})
    })

    store.dispatch(addUsers(users))
  }

  async listChannels () {
    const query = { query: { terms: { type: ['public', 'restricted'] } } }
    const result = await this.channelsCollection.searchPromise(query, { size: 100 })
    const channels = []

    result.getDocuments().forEach(function(document) {
      channels.push({...document.content, id: document.id})
    })

    store.dispatch(addChannels(channels))
  }

  async listPrivateChannels () {
    const query = { query: { bool: { should: [{ bool: { must: [{ match_phrase_prefix: { 'users': store.getState().users.current.id } }, { match_phrase_prefix: { type: 'private' } }] } }] } } }

    const result = await this.channelsCollection.searchPromise(query)
    const privateChannels = []

    result.getDocuments().forEach(function(document) {
      privateChannels.push({...document.content, id: document.id})
    })

    store.dispatch(addPrivateChannels(privateChannels))
  }

  async createMessage (message) {
    return this.messagesCollection.createDocumentPromise(message)
  }

  async createChannel (label, userId = null) {
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

  async updateUser () {
    const currentUser = {...store.getState().users.current}
    delete currentUser.id

    return this.usersCollection.updateDocument(store.getState().users.current.id, {...currentUser})
  }

  resetSubscribe () {
    rooms.forEach(room => room.unsubscribe())
  }
}

function storeChannels (result) {
  const channel = {
    ...result.document.content,
    id: result.document.id,
    unread: false
  }

  if (channel.type === 'private') {
    store.dispatch(addPrivateChannels([channel]))
  } else {
    store.dispatch(addChannels([channel]))
  }
}

export default new KuzzleWrapper()