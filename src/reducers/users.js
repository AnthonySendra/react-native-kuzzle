const initState = {
  users: []
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