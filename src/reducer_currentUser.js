import { STORE_CURRENT_USER } from './app/actions'

export default (state = {}, action) => {
  switch(action.type) {
    case STORE_CURRENT_USER:
      const newState = action.payload;
      console.log('fromReducer')
      console.log(newState)
      return newState;

    default:
      return state;
  }
}
