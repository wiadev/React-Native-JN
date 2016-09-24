import { STORE_FEEDS_NAME } from './app/actions'

export default (state = {}, action) => {
  switch(action.type) {
    case STORE_FEEDS_NAME:
      const newState = action.payload;
      return newState;

    default:
      return state;
  }
}
