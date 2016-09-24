import { STORE_FEED } from './app/actions'

export default (state = [], action) => {
  switch(action.type) {
    case STORE_FEED:
      const newState = action.payload;
      return newState;

    default:
      return state;
  }
}
