import Kuzzle from 'kuzzle-sdk/dist/kuzzle.js'
import store from '../store'
import {addUsers} from '../reducers/users'

Kuzzle.prototype.bluebird = require('bluebird')
let roomMessages
let roomChannels
let roomUsers

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

  subscribeBump (currentUser, cb) {
    const filter = {and: [{equals: {event: 'bump'}}, {equals: {bumping: currentUser}}]}
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

        cb(err, result)
      })
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return;
        }
        roomMessages = roomObject
      })
  }

  subscribeChannels (cb) {
    this.channelsCollection
      .subscribe({}, {subscribeToSelf: false, scope: 'in'}, (err, result) => cb(err, result))
      .onDone((err, roomObject) => {
        if (err) {
          console.error(err)
          return;
        }
        roomChannels = roomObject
      })
  }

  subscribeUsers () {
    this.usersCollection.subscribe({}, {scope: 'in'}, (err, result) => {
      store.dispatch(addUsers([{...result.document.content, id: result.document.id}]))
    })
  }

  bump (currentUser, userId, back = false) {
    this.messagesCollection.publishMessage({
      event: 'bump',
      userId: currentUser,
      bumping: userId,
      back
    })
  }

  async listMessages (channel) {
    const query = {
      query: {term: {channel}},
      sort: [{ timestamp: 'asc' }]
    }
    return this.messagesCollection.searchPromise(query, { size: 100 })
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
    return this.channelsCollection.searchPromise(query)
  }

  async createMessage (message) {
    return this.messagesCollection.createDocumentPromise(message)
  }

  async createChannel (id, channel) {
    return this.channelsCollection.createDocumentPromise(id, channel)
  }

  async updateUser (id, user) {

    return this.usersCollection.updateDocument(id, {...user})
  }

  resetSubscribe () {
    if (roomMessages) {
      roomMessages.unsubscribe()
    }
    if (roomChannels) {
      roomChannels.unsubscribe()
    }
  }
}

export default new KuzzleWrapper()