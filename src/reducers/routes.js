import { ActionConst } from 'react-native-router-flux';

const initialState = {
  scene: {},
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionConst.FOCUS:
      console.log('focus')
      return {
        ...state,
        scene: action.scene,
      }
    default:
      return state
  }
}
