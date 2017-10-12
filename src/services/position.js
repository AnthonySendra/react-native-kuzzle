import store from '../store'
import { Permissions, Location } from 'expo'
import { updatePermissionLocation, updateLocation } from '../reducers/users'


class Position {
  async checkRights () {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    this.allowed = (status === 'granted')

    store.dispatch(updatePermissionLocation(this.allowed))
  }

  subscribe (cb) {
    if (!this.allowed) {
      return
    }

    Location.watchPositionAsync({timeInterval: 1000, distanceInterval: 2}, ({coords}) => {
      store.dispatch(updateLocation(coords))
    })
  }
}

export default new Position()