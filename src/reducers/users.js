const initState = {
  list: [],
  current: {
    id: 'asendra@kaliop.com',
    nickname: 'Anthony Sendra',
    avatar: 'http://www.gravatar.com/avatar/d40525194061a31d1adb64bf8d0f5206?d=identicon',
    ido: `Essayer c'est le premier pas vers l'échec.`
  },
  permissionLocation: false,
  location: {
    latitude: 43.607436,
    longitude: 3.912948
  }
}

const USERS_ADD = 'USERS_ADD'
const USER_UPDATE = 'USER_UPDATE'
const PERMISSION_LOCATION_UPDATE = 'PERMISSION_LOCATION_UPDATE'
const LOCATION_UPDATE = 'LOCATION_UPDATE'

export const addUsers = (payload) => ({type: USERS_ADD, payload})
export const updateUser = (payload) => ({type: USER_UPDATE, payload})
export const updatePermissionLocation = (payload) => ({type: PERMISSION_LOCATION_UPDATE, payload})
export const updateLocation = (payload) => ({type: LOCATION_UPDATE, payload})

export default (state = initState, action) => {
  switch (action.type) {
    case USERS_ADD:
      return {...state, list: [...state.list, ...action.payload]}
    case USER_UPDATE:
      return {...state, current: {...state.current, ...action.payload}}
    case PERMISSION_LOCATION_UPDATE:
      return {...state, permissionLocation: action.payload}
    case LOCATION_UPDATE:
      return {...state, location: {...action.payload}}
    default:
      return state
  }
}

export const listUsersByIds = (state) => {
  const users = {}
  state.list.forEach(user => {
    users[user.id] = {...user}
  })

  return users
}

export const listUsers = (state) => {
  return state.list
    .filter(user => {
      return user.id !== state.current.id
    })
}
