const initState = {
  users: [],
  currentUser: {
    id: 'asendra@kaliop.com',
    nickname: 'Anthony Sendra',
    avatar: 'http://www.gravatar.com/avatar/d40525194061a31d1adb64bf8d0f5206?d=identicon',
    ido: `Essayer c'est le premier pas vers l'échec.`
  }
}

const USER_ADD = 'USER_ADD'
const USERS_ADD = 'USERS_ADD'

export const addUsers = (payload) => ({type: USERS_ADD, payload})

export default (state = initState, action) => {
  switch (action.type) {
    case USERS_ADD:
      return {...state, users: [...state.users, ...action.payload]}
    default:
      return state
  }
}

export const listUsersByIds = (state) => {
  const users = {}
  state.users.forEach(user => {
    users[user.id] = {...user}
  })

  return users
}

export const listUsers = (state) => {
  return state.users
    .filter(user => {
      return user.id !== state.currentUser.id
    })
}