import Kuzzle from 'kuzzle-sdk/dist/kuzzle.js'

Kuzzle.prototype.bluebird = require('bluebird')
let roomMessages
let roomChannels

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

  bump (currentUser, userId) {
    this.messagesCollection.publishMessage({
      event: 'bump',
      userId: currentUser,
      bumping: userId,
      back: true
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
    return this.usersCollection.searchPromise({}, {})
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

  resetSubscribe () {
    roomMessages.unsubscribe()
    roomChannels.unsubscribe()
  }
}

export default new KuzzleWrapper()