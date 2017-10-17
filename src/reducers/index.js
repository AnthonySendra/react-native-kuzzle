import { combineReducers } from 'redux'
import users from './users'
import channels from './channels'
import routes from './routes'

export default combineReducers({
  users,
  channels,
  routes
})