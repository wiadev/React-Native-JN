import { NAME } from './constants';

export const getAppRoot = (state) => state[NAME].root;
export const getInitComplete = (state) => state[NAME].initComplete;
export const getLoginComplete = (state) => state[NAME].fbLoginComplete;
export const getLoggingIn = (state) => state[NAME].loggingIn;
export const getLoginError = (state) => state[NAME].loginError;
