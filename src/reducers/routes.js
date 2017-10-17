import { ActionConst } from 'react-native-router-flux';

const initialState = {
  currentScene: 'chat'
}
export const changeFocus = (type, payload) => ({type, payload})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionConst.PUSH:
      return {
        ...state,
        currentScene: action.payload,
      }
    default:
      return state
  }
}
