import immutable from 'seamless-immutable';
import * as types from './actionTypes';
import { FILTERS } from './constants';

export const initialState = immutable({
  feed: null,
  filterId: FILTERS.newest.id
});

export default function home(state = initialState, action = {}) {
  switch (action.type) {
    case types.CHANGE_FEED:
      return state.set('feed', action.feed);
    case types.TOGGLE_FILTER:
      if (state.filterId === FILTERS.hot.id) {
        return state.set('filterId', FILTERS.newest.id);
      }
      return state.set('filterId', FILTERS.hot.id);
    default:
      return state;
  }
}
