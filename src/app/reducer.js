import immutable from 'seamless-immutable';
import * as types from './actionTypes';
import * as constants from './constants';

export const initialState = immutable({
  root: constants.LOGIN_ROOT,
  userId: null,
  status: null,
  loginError: null,
  loggingIn: false,
  initComplete: false,
  fbLoginComplete: false
});

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.ROOT_CHANGED:
      return state.merge({
        root: action.root
      });
    case types.INIT_APP_COMPLETE:
      return state.merge({
        userId: action.userId,
        initComplete: true,
        status: action.status
      });
    case types.CONFIRM_EMAIL:
    case types.FB_LOGIN:
    case types.LOGIN:
      return state.merge({
        loggingIn: true,
        loginError: null
      });
    case types.FB_LOGIN_SUCCESS:
      return state.merge({
        fbLoginComplete: true,
        loggingIn: false,
        loginError: null
      });
    case types.LOGIN_SUCCESS:
      return state.merge({
        fbLoginComplete: false,
        loggingIn: false,
        loginError: null
      });
    case types.FB_LOGIN_ERROR:
    case types.CONFIRM_EMAIL_ERROR:
    case types.LOGIN_ERROR:
      return state.merge({
        loggingIn: false,
        loginError: action.error
      });
    default:
      return state;
  }
}