const initState = {
  users: [
    {
      id: 'asendra@kaliop.com',
      nickname: 'Anthony Sendra',
      avatar: 'http://www.gravatar.com/avatar/d40525194061a31d1adb64bf8d0f5206?d=identicon'
    },
    {
      id: 'sbouic@kaliop.com',
      nickname: 'Jean Anderson',
      avatar: 'https://randomuser.me/api/portraits/women/97.jpg'
    }
  ]
}
export default (state = initState, action) => {
  switch (action.type) {
    case 'USER_ADD':
      return {...state, users: state.users.concat(action.payload)}
    default:
      return state
  }
}