const initState = {
  list: [],
  listPrivate: [],
  current: {
    id: '#kuzzle',
    label: 'kuzzle'
  },
  geo: {
    id: '#geo',
    label: 'Geo channel',
    icon: 'location-on'
  },
  searching: false,
  searchText: null
}

const CHANNELS_ADD = 'CHANNELS_ADD'
const CHANNELS_PRIVATE_ADD = 'CHANNELS_PRIVATE_ADD'
const CHANNELS_SELECT = 'CHANNELS_SELECT'
const UNREAD_CHANNEL_SET = 'UNREAD_CHANNEL_SET'
const SEARCHING_TOGGLE = 'SEARCHING_TOGGLE'

export const addChannels = (payload) => ({type: CHANNELS_ADD, payload})
export const addPrivateChannels = (payload) => ({type: CHANNELS_PRIVATE_ADD, payload})
export const selectChannel = (payload) => ({type: CHANNELS_SELECT, payload})
export const setChannelUnread = (payload) => ({type: UNREAD_CHANNEL_SET, payload})
export const toggleSearching = () => ({type: SEARCHING_TOGGLE})

export default (state = initState, action) => {
  switch (action.type) {
    case CHANNELS_ADD:
      return {...state, list: [...state.list, ...action.payload]}
    case CHANNELS_SELECT:
      return {...state, current: {...action.payload}}
    case CHANNELS_PRIVATE_ADD:
      return {...state, listPrivate: [...state.listPrivate, ...action.payload]}
    case UNREAD_CHANNEL_SET:
      const newList = state.list.map(channel => {
        if (channel.id === action.payload.id) {
          channel.unread = action.payload.unread
        }
        return channel
      })

      const newListPrivate = state.listPrivate.map(channel => {
        if (channel.id === action.payload.id) {
          channel.unread = action.payload.unread
        }
        return channel
      })

      return {...state, list: [...newList], listPrivate: [...newListPrivate]}
    case SEARCHING_TOGGLE:
      return {...state, searching: !state.searching}
    default:
      return state
  }
}

export const listChannel = (state) => {
  return state.list.sort((a, b) => {
    return a.label.localeCompare(b.label)
  })
}

export const listPrivateChannel = (state, currentUserId, usersById) => {
  return state.listPrivate
    .map(channel => {
      const otherUser = channel.users[0] === currentUserId ? usersById[channel.users[1]] : usersById[channel.users[0]]

      return {
        ...channel,
        label: otherUser.nickname,
        icon: otherUser.avatar
      }
    })
    .sort((a, b) => {
      return a.label.localeCompare(b.label)
    })
}

export const isChannelUnread = (state) => {
  return (state.list.some(channel => channel.unread) || state.listPrivate.some(channel => channel.unread))
}