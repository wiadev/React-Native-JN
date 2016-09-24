import { combineReducers } from 'redux';
import * as app from './app';
import * as home from './home';
import instagram from './lib/instagram';
import homePost from './home/actions';
import posts from './post/actions';
import notifications from './notifications/actions';
import facebook from './lib/facebook';
import current_user from './reducer_currentUser';
import feeds_name from './reducer_feedsName';
import feeds from './reducer_feeds'
import messages from './messages/actions';
import profile from './profile/actions';

export default combineReducers({
  [app.constants.NAME]: app.reducer,
  [home.constants.NAME]: home.reducer,
  instagram: instagram,
  homePost: homePost,
  posts: posts,
  notifications: notifications,
  facebook: facebook,
  currentUser: current_user,
  feeds: feeds,
  feedsName: feeds_name,
  messages: messages,
  profile: profile
});
