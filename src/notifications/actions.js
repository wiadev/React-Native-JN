
import config from '../config';
import immutable from 'seamless-immutable';
import _ from 'lodash';
import * as types from './constants';
import * as firebase from 'firebase';
import screens from '../screens';
import { Colors } from '../UI';
import * as actions from './../home/actions';

const initialState = immutable({
  notifications: [],
  loading: false,
  error: null
});

const LOAD_NOTIFICATIONS = 'Juno.Notification.LOAD_NOTIFICATIONS';
const LOAD_NOTIFICATIONS_SUCCESS = 'Juno.Notification.LOAD_NOTIFICATIONS_SUCCESS';
const LOAD_NOTIFICATIONS_ERROR = 'Juno.Notification.LOAD_NOTIFICATIONS_ERROR';

export default function notifications(state = initialState, action = {}) {
  switch (action.type) {

    case LOAD_NOTIFICATIONS:
      return state.merge({
        loading: true,
        notifications: []
      });
    case LOAD_NOTIFICATIONS_SUCCESS:
      return state.merge({
        loading: false,
        notifications: action.notifications
      });
    case LOAD_NOTIFICATIONS_ERROR:
      return state.merge({
        loading: false,
        notifications: []
      });
    default:
      return state;
  }
}



export const loadNotifications = () => (dispatch, getState) => {
  dispatch({ type: LOAD_NOTIFICATIONS });

  const user = getState().currentUser;

  let ref = firebase.database().ref(`/notifications/${user._id}/`).limitToLast(20);


  ref.on("value", (snapshot) => {
    let notifications =  _.map(snapshot.val(), (obj) => obj);

    _.reverse(notifications);

    dispatch({ type: LOAD_NOTIFICATIONS_SUCCESS, notifications});

  }, (error) => {
     dispatch({ type: LOAD_NOTIFICATIONS_ERROR, error: error});
  })
};

export const getNotifications = (state) => { return state.notifications.notifications; };
export const getLoading = (state) => state.notifications.loading;



export const handleNotification = (obj, navigator) => dispatch => {
  console.log('handleNotification', obj.type);
  if(obj.type == 'comment')
    navigator.showModal({
      screen: screens.post,
      title: 'Post',
      passProps: {post: obj},
      navigatorStyle: {
        navBarTextColor: Colors.secondary,
        navBarButtonColor: Colors.primary,
      }
    });
  /*else if (obj.type == 'heart')
    navigator.showModal({
      screen: screens.profile,
      title: 'Profile',
      passProps: {user: obj},
      navigatorStyle: {
        navBarTextColor: Colors.secondary,
        navBarButtonColor: Colors.primary,
      }
    });*/

};

export const sendNotification = (title, body, userId, type,  obj ) => {
  firebase.database().ref(`/users/${userId}`).once("value", function(snap) {
    var user = snap.val();

    let newKey= firebase.database().ref().child('notifications').push().key;
    let updates = {};

    updates[`/notifications/${userId}/${newKey}`] = {title: title, body: body, _id: obj._id, type: type, createdAt: new Date()};
    firebase.database().ref().update(updates)

    if(user && user.token){
      send(title, body, user, obj, type);
    }
  });
};

export function send(title, body, user, post, type) {

  let message = {
    'to' : user.token,
    'content_available': true,
    'notification': {
      title: user.os !== 'ios' ? 'Juno' : title,
      body: title + ' ' + body,
      click_action: 'fcm.ACTION.HELLO',
      'sound': 'default'
    },
    'priority': "high"
  };

  if(post){
    message.data =  { _id: post._id , type: type};
    if(type =='comment') message.data.user = {_id: post.user._id};
  }

  var param = JSON.stringify(message)

  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('success', request.responseText);
    } else {
      console.warn('error');
    }
  };

  request.open('POST', 'https://fcm.googleapis.com/fcm/send');

  request.setRequestHeader("Content-Type","application/json");
  request.setRequestHeader("Authorization","key="+ config.keyFcm);
  request.send(param);

}
