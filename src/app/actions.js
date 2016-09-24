import _ from 'lodash';
import * as firebase from 'firebase';
import * as types from './actionTypes';
import * as constants from './constants';
import { actions as homeActions } from '../home';
import { updateAvatar } from '../profile/actions';
import { AccessToken, LoginManager ,GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import config from '../config';
import mockData from '../mockData';
import Rebase from 're-base'
const trimString = (str) => str.replace(/^\s+|\s+$/gm, '');

// define action type for storing current user data
export const STORE_CURRENT_USER = 'STORE_CURRENT_USER';
export const STORE_FEED = 'STORE_FEED';
export const STORE_FEEDS_NAME = 'STORE_FEEDS_NAME';


// rebase initialization
export let rebase = null;

// store universities list from database
let universities = [];
let universitiesName = [];

// store current user details
let currentUserDetail = null;

// all users those are currently using the app
// this is to check if the user is a new user
let appUserList = [];

// store university email to add it to new user database entry
let currentUserUniversityEmail = null;
let currentUserUniversityDomain = null;

export function changeAppRoot(root) {
  return { type: types.ROOT_CHANGED, root };
}

export function initApp() {
  return (dispatch) => {
    // any app initialization logic here
    dispatch({ type: types.INIT_APP });



    //firebase.initializeApp(config.firebaseConfig);

    // initialize rebase as a helper with firebase
    // this will also initialize the firebase app
    // so no need to ininitialize firebase again
    rebase = Rebase.createClass(config.firebaseConfig);

    new Promise((resolve, reject) => {
      // get university names to match the email
      firebase.database().ref('/universities').once('value').then((data) => {
        universities = data.val();
        _.forEach(universities, university => {
          universitiesName[university.feed] = university;
        })
        dispatch({ type: STORE_FEED, payload: data.val() });
        dispatch({ type: STORE_FEEDS_NAME, payload: universitiesName });
        resolve()
      })
    })
    .then(() => {

      firebase.auth().onAuthStateChanged((user) => {
        
        if (user) {

          firebase.database().ref(`/users/${user.uid}`).once("value", function(snap) {
            var user = snap.val();
            if(user){


              dispatch({type: STORE_CURRENT_USER, payload: user})
              dispatch(homeActions.changeFeed(universitiesName[user.universityFeed]));
              dispatch(changeAppRoot(constants.MAIN_ROOT));
            }
            else{
              dispatch({ type: types.LOGIN_ERROR, error: 'Error' });
            }
              
          });
          
      } else {
          dispatch(changeAppRoot(constants.ONBOARDING_ROOT));
        }
        dispatch({ type: types.INIT_APP_COMPLETE });
      });
    })

  };
}

export function loginWithToken(emailUniversity, image) {
  return (dispatch) => {
    dispatch({ type: types.LOGIN });
    let token = '';
    return AccessToken.getCurrentAccessToken()
    .then((data) => {
      token = data.accessToken.toString();
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      return firebase.auth().signInWithCredential(credential);
       
       
    })
    .then((user) => {
      

      let {
        displayName,
        email,
        photoURL,
        uid,
      //  providerData
      } = user;
      

      let index = emailUniversity.indexOf('@');
      let emailDomain = emailUniversity.substring(index+1, emailUniversity.length);
      const universityFeed = emailDomain.replace('.', '-')
      
      user = {
        _id: uid,
        email: email,
        emailUniversity: emailDomain,
        avatar: image || photoURL,
        name: displayName,
        universityFeed: universityFeed
      }
      
      dispatch({type: STORE_CURRENT_USER, payload: user})

      let updates = {};
      updates[`/users/${uid}/_id`] = uid;
      updates[`/users/${uid}/avatar`] = image || photoURL;
      updates[`/users/${uid}/universityFeed`] = universityFeed;
      updates[`/users/${uid}/email`] = email;
      updates[`/users/${uid}/emailUniversity`] = emailUniversity;
      updates[`/users/${uid}/name`] = displayName;
      updates[`/users/${uid}/token`] = '';
      firebase.database().ref().update(updates)
      
      dispatch(updateAvatar(user));

      setTimeout(() => dispatch({ type: types.LOGIN_SUCCESS, user }), 1000)
      
    })
    .catch(err => {
      dispatch({ type: types.LOGIN_ERROR, error: err.message });
    });
  };
}

export function loginWithFB() {
  return (dispatch) => (
    LoginManager.logInWithReadPermissions(constants.FB_PERMISSIONS)
    .then(result => {
      if (result.isCancelled) {
        throw new Error('Facebook Login Cancelled');
      }
      dispatch({ type: types.FB_LOGIN_SUCCESS, permissions: result.grantedPermissions.toString() });
    })
    .catch(err => {
      dispatch({ type: types.FB_LOGIN_ERROR, error: err.message });
      console.log(err);
    })
  );
}

export function confirmEmail(email) {
  return (dispatch) => {
    dispatch({ type: types.CONFIRM_EMAIL });
    if (!(email)) {
      return dispatch({ type: types.CONFIRM_EMAIL_ERROR, error: 'Please enter an email' });
    }

    return new Promise((resolve, reject) => {
      // logic to confirm email with server
      let index = email.indexOf('@');
      let emailDomain = email.substring(index+1, email.length);

      currentUserUniversityEmail = email;
      currentUserUniversityDomain = emailDomain;

      // check if the users university email match with university list from database
      _.map(universities, (universityEach) => {
        if (universityEach.domain == emailDomain) 
          resolve()
      })
      reject({message: 'University domain is not in our database.'});
    })
    .then(() => {
      const infoRequest = new GraphRequest(
        'me?fields=picture.height(400)',
        null,
        function (error: ?Object, result: ?Object) {

        let image =  '';
        if (error) {
          dispatch({ type: types.CONFIRM_EMAIL_ERROR, error: error.message})
        } else {
          console.log('result' ,result.picture.data.url);
          image = result.picture && result.picture.data && result.picture.data.url ? result.picture.data.url: '';

          
          
        }
        dispatch({ type: types.CONFIRM_EMAIL_SUCCESS });
        dispatch(loginWithToken(email, image));
          
      });
      new GraphRequestManager().addRequest(infoRequest).start();
      
      
    })
    .catch(err => {
      dispatch({ type: types.CONFIRM_EMAIL_ERROR, error: err.message });
    });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: types.LOGOUT });
    return firebase.auth().signOut();
  };
}

export function goToFeed(feed, navigator) {
  return (dispatch) => {
    dispatch(homeActions.changeFeed(feed));
    navigator.toggleDrawer({
      to: 'closed',
      side: 'left',
      animated: true
    });
  };
}
