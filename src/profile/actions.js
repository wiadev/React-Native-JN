import * as firebase from 'firebase';
import { sendNotification }  from './../notifications/actions';
import icons from '../img/appIcons';
import immutable from 'seamless-immutable';
import _ from 'lodash'


const initialState = immutable({
  matches: [],
  friends: [],
  messages: [],
  chats: [],
  loading: false,
  loadingMatches: false,
  loadingMessages: false,
  loadingChats: false,
  error: null
});

const LOAD_FRIENDS = 'Juno.Profile.LOAD_FRIENDS';
const LOAD_FRIENDS_SUCCESS = 'Juno.Profile.LOAD_FRIENDS_SUCCESS';
const LOAD_FRIENDS_ERROR = 'Juno.Profile.LOAD_FRIENDS_ERROR';

const LOAD_PROFILE = 'Juno.Profile.LOAD_PROFILE';
const LOAD_PROFILE_SUCCESS = 'Juno.Profile.LOAD_PROFILE_SUCCESS';

const LOAD_BLOCKS = 'Juno.Profile.LOAD_BLOCKS';
const LOAD_BLOCKS_SUCCESS = 'Juno.Profile.LOAD_BLOCKS_SUCCESS';



const LOAD_MATCHES_SUCCESS = 'Juno.Profile.LOAD_MATCHES_SUCCESS';



export default function profile(state = initialState, action = {}) {
  switch (action.type) {

    case LOAD_FRIENDS:
      return state.merge({
        loading: true,
        friends: [] 
      });
    case LOAD_FRIENDS_SUCCESS:
      return state.merge({
        loading: false,
        friends: action.friends
      });
    case LOAD_FRIENDS_ERROR:
      return state.merge({
        loading: false,
        friends: []
      });
    case LOAD_MATCHES_SUCCESS:
      return state.merge({
        loading: false,
        matches: action.matches
      });
    case LOAD_BLOCKS:
      return state.merge({
        blocks: []
      });
    case LOAD_BLOCKS_SUCCESS:
      return state.merge({
        blocks: action.blocks
      });
    default:
      return state;

  }
}

export const loadFriends = (blocks) => (dispatch, getState) => {
  dispatch({ type: LOAD_FRIENDS });  
  const currentUser = getState().currentUser;

  firebase.database().ref(`/friends/${currentUser._id}`)
  .orderByChild("heart").equalTo(true)
  .on('value', (snapshot) => {
    let friends =  _.map(snapshot.val(), (obj) => obj);
    _.reverse(friends);

      dispatch({ type: LOAD_FRIENDS_SUCCESS, friends});

      let matches = _.filter(friends, (obj) => !obj.match);
      dispatch({ type: LOAD_MATCHES_SUCCESS, matches});
  })
    
  
};

export const updateAvatar = (user) => () => {

  new Promise((resolve, reject) => {
    updates = {};
    firebase.database().ref(`/comments`)
    .orderByChild('user/_id').equalTo(user._id)
    .once('value', (snapshot) => {
      _.forEach(snapshot.val(), comment =>{
        updates[`/comments/${comment._id}/user/avatar`] = user.avatar;
      })
      resolve(updates);
    })
  })
  .then((updates) =>{
     firebase.database().ref().update(updates);
  })

}


export const loadBlocks = () => (dispatch, getState) => {
  dispatch({ type: LOAD_BLOCKS }); 
  const user = getState().currentUser; 
  console.log('useruser', user)
  
  firebase.database().ref(`/blocks/${user._id}`)
  .on('value', (snapshot) => {
    let blocks =  _.map(snapshot.val(), (obj) => obj.user._id);

   
    dispatch({ type: LOAD_BLOCKS_SUCCESS, blocks});

  })

}

export const setButtonsHeart = (isFriend, navigator) => (dispatch) => {
  navigator.setButtons({
    rightButtons: [{
      icon: isFriend ? icons.liked : icons.like,
      id: 'like',
      disableIconTint: !!isFriend
    }]
  });
}


export const getBlocks = (state) =>  state.profile.blocks;
export const getFriends = (state) => state.profile.friends;
export const getLoading = (state) => state.profile.loading;
export const getNewMatches = (state) => state.profile.matches;

    

export const likeUser = (currentUser, user, feeds) => dispatch => {
  
  let refFriend = firebase.database().ref(`/friends/${currentUser._id}/${user._id}`)
  
  refFriend.once("value", snapshot => {
     
    new Promise((resolve, reject) => {
      let updates = {};

      if(!snapshot.exists()){
        const current = {
          _id: currentUser._id ,
          avatar: currentUser.avatar,
          name: currentUser.name
        };
        
        let chatKey = firebase.database().ref().child('chats').push().key;

        universityName = feeds[currentUser.universityFeed].name

        updates[`/friends/${currentUser._id}/${user._id}`] = {user: user, createdAt: Date.now(), chatKey: chatKey, heart: true, match: false};
        updates[`/friends/${user._id}/${currentUser._id}`] = {user: current, createdAt: Date.now(), chatKey: chatKey, heart: true, match: false};
        
        

        sendNotification('Someone just liked you!', 'Hint: '+ universityName, user._id, 'heart', current);
        resolve(updates);
      }
      else{

        let data = snapshot.val();
        updates[`/friends/${currentUser._id}/${user._id}/heart`] = !data.heart;
        updates[`/friends/${user._id}/${currentUser._id}/heart`] = !data.heart;

        let refLastMessages = firebase.database().ref(`/lastMessages/${currentUser._id}/${user._id}`)
        
         refLastMessages.once("value", function(message) {
          if(message.exists()){
            updates[`/lastMessages/${user._id}/${currentUser._id}/heart`] = !data.heart;
            updates[`/lastMessages/${currentUser._id}/${user._id}/heart`] = !data.heart;
          }
          
          resolve(updates);
        })  
      }
      
    })
    .then(updates => {
       firebase.database().ref().update(updates)
    })

  })

};

export const SnapchatChange = (snapchat, currentUser) => dispatch => {
  
  let refUser= firebase.database().ref(`/users/${currentUser._id}`)
  refUser.update({snapchat: snapchat});
  
};
export const InstagramChange = (instagram, currentUser) => dispatch => {
  
  let refUser= firebase.database().ref(`/users/${currentUser._id}`)
  refUser.update({instagram: instagram});
  
};
