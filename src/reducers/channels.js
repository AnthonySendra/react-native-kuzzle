const initState = {
  list: [],
  listPrivate: [],
  current: {
    id: '#kuzzle',
    label: 'kuzzle'
  }
}

const CHANNELS_ADD = 'CHANNELS_ADD'
const CHANNELS_PRIVATE_ADD = 'CHANNELS_PRIVATE_ADD'
const CHANNELS_SELECT = 'CHANNELS_SELECT'

export const addChannels = (payload) => ({type: CHANNELS_ADD, payload})
export const addPrivateChannels = (payload) => ({type: CHANNELS_PRIVATE_ADD, payload})
export const selectChannel = (payload) => ({type: CHANNELS_SELECT, payload})

export default (state = initState, action) => {
  switch (action.type) {
    case CHANNELS_ADD:
      return {...state, list: [...state.list, ...action.payload]}
    case CHANNELS_SELECT:
      return {...state, current: {...action.payload}}
    case CHANNELS_PRIVATE_ADD:
      return {...state, listPrivate: [...state.listPrivate, ...action.payload]}
    default:
      return state
  }
}

export const listChannel = (state) => {
  return state.list.sort((a, b) => {
    return a.label > b.label
  })
}

export const listPrivateChannel = (state, currentUserId, usersById) => {
  return state.listPrivate
    .map(channel => {
      const otherUser =  channel.users[0] === currentUserId ? usersById[channel.users[1]] : usersById[channel.users[0]]

      return {
        ...channel,
        label: otherUser.nickname,
        icon: otherUser.avatar
      }
    })
    .sort((a, b) => {
      return a.label > b.label
    })
}