const initState = {
  list: [],
  current: {
    id: 'asendra@kaliop.com',
    nickname: 'Anthony Sendra',
    avatar: 'http://www.gravatar.com/avatar/d40525194061a31d1adb64bf8d0f5206?d=identicon',
    ido: `Essayer c'est le premier pas vers l'échec.`
  }
}

const USERS_ADD = 'USERS_ADD'
const USER_UPDATE = 'USER_UPDATE'

export const addUsers = (payload) => ({type: USERS_ADD, payload})
export const updateUser = (payload) => ({type: USER_UPDATE, payload})

export default (state = initState, action) => {
  switch (action.type) {
    case USERS_ADD:
      return {...state, list: [...state.list, ...action.payload]}
    case USER_UPDATE:
      return {...state, current: {...state.current, ...action.payload}}
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
