import screens from '../screens';
import { Colors } from '../UI';
import * as firebase from 'firebase';
import * as upload from '../lib/upload';


import immutable from 'seamless-immutable';
import _ from 'lodash'

const initialState = immutable({
  messages: [],
  chats: [],
  loadingMessages: false,
  loadingChats: false,
  error: null
});

const LOAD_MESSAGES = 'Juno.Messages.LOAD_MESSAGES';
const LOAD_MESSAGES_SUCCESS = 'Juno.Messages.LOAD_MESSAGES_SUCCESS';
const LOAD_MESSAGES_ERROR = 'Juno.Messages.LOAD_MESSAGES_ERROR';

const LOAD_CHATS = 'Juno.Messages.LOAD_CHATS';
const LOAD_CHATS_SUCCESS = 'Juno.Messages.LOAD_CHATS_SUCCESS';
const LOAD_CHATS_ERROR = 'Juno.Messages.LOAD_CHATS_ERROR';
const LOAD_NUMUNREAD_SUCCESS = 'Juno.Messages.LOAD_NUMUNREAD_SUCCESS';


export default function messages(state = initialState, action = {}) {
  switch (action.type) {
    
    case LOAD_MESSAGES:
      return state.merge({
        loadingMessages: true,
        messages: []
      });
    case LOAD_NUMUNREAD_SUCCESS:
      return state.merge({
        numUnread: action.numUnread
      });
    case LOAD_MESSAGES_SUCCESS:
      return state.merge({
        loadingMessages: false,
        messages: action.messages
      });
    case LOAD_MESSAGES_ERROR:
      return state.merge({
        loadingMessages: false,
        messages: []
      });
    case LOAD_CHATS:
      return state.merge({
        loadingChats: true,
        chats: []
      });
    case LOAD_CHATS_SUCCESS:
      return state.merge({
        loadingChats: false,
        chats: action.chats
      });
    case LOAD_CHATS_ERROR:
      return state.merge({
        loadingChats: false,
        chats: []
      });
    default:
      return state;
  }
}





export const loadChats = () => (dispatch, getState) => {
 
  dispatch({ type: LOAD_CHATS });

  const user = getState().currentUser;

    firebase.database().ref(`/lastMessages/${user._id}`)
    .orderByChild("heart").equalTo(true)
    .on('value', (snapshot) => {
      let numUnread = 0;
      let chats =  _.map(snapshot.val(), (obj) => obj);

      numUnread = _.sumBy(chats, (message) => message.unread);
      dispatch({ type: LOAD_CHATS_SUCCESS, chats});
      dispatch({ type: LOAD_NUMUNREAD_SUCCESS, numUnread});
    }) 
  
};

export const stopLoadMessages = (chat) => (dispatch, getState) => {
  console.log('stopLoadMessages');
  const user = getState().currentUser;
  firebase.database().ref(`/chats/${chat.chatKey}`).off('value');
  firebase.database().ref(`/lastMessages/${user._id}/${chat.user._id}`).off('value');
}

export const loadMessages = (chat) => (dispatch, getState) => {
  const user = getState().currentUser;
  
  dispatch({ type: LOAD_MESSAGES});
  firebase.database().ref(`/chats/${chat.chatKey}`).on('value', (snapshot) => {
    let messages =  _.reverse(_.map(snapshot.val(), (obj) => {return obj}));
    dispatch({ type: LOAD_MESSAGES_SUCCESS, messages});
  })

  let refLastMessage = firebase.database().ref(`/lastMessages/${user._id}/${chat.user._id}`);

  refLastMessage.on('value', (snapshot) => {
    let last = snapshot.val();

    if(snapshot.exists() && last && last.unread !=0)
      refLastMessage.child('unread').set(0);
  });

}

export const getMessages = (state) => state.messages.messages;
export const getLoadingMessage = (state) => state.messages.loadingMessages;
export const getChats = (state) => state.messages.chats;
export const getLoadingChat = (state) => state.messages.loadingChats;
export const getNumUnread = (state) => state.messages.numUnread;



export const goToChat = (chat, navigator) => dispatch => {
  navigator.showModal({
    screen: screens.chat,
    title: chat.user.name || 'Chat',
    passProps: { chat },
    navigatorStyle: {
      navBarHidden: true
    }
  });
};

export const sendMessage = (message, chat) => dispatch => {

  let image = message.image;
  message.image = '';

  let updates = {};
  new Promise((resolve, reject) => {
    
    let refFriend = firebase.database().ref(`/friends/${message.user._id}/${chat.user._id}`)
    
    
    refFriend.once("value", function(snapshot) {
      let data = snapshot.val();
      if(!data.match){
        updates[`/friends/${message.user._id}/${chat.user._id}/match`] = true;
      }
      resolve(data);
    })

  })
  .then((friend) => {

    let newMessageKey = firebase.database().ref().child('messages').push().key;
    
    let lastMessage = {
      lastMessage: message.text,
      updateAt: new Date(),
      user: message.user,
      chatKey: chat.chatKey,
      heart: friend.heart
    }

    updates[`/chats/${chat.chatKey}/${newMessageKey}`] = message;
    updates[`/lastMessages/${chat.user._id}/${message.user._id}`] = lastMessage;
    
    new Promise((resolve, reject) => {


      let refMessage= firebase.database().ref(`/lastMessages/${message.user._id}/${chat.user._id}`)
      
      refMessage.once("value", function(snapshot) {
        if(!snapshot.val()){
          updates[`/lastMessages/${message.user._id}/${chat.user._id}`] = {
            lastMessage: '',
            updateAt: new Date(),
            user: chat.user,
            chatKey: chat.chatKey,
            heart: friend.heart,
            unread: 0
          };
        }

        resolve(updates);
      })

    })
    .then((updates) => {



      new Promise((resolve, reject) => {
        let refLastMessage = firebase.database().ref(`/lastMessages/${chat.user._id}/${message.user._id}`);

   
        refLastMessage.once('value', (snapshot) => {
          let last = snapshot.val();
          const  unread = !snapshot.exists() ? 1 : (last.unread+1);
          let lastMessage = {
            lastMessage: message.text,
            updateAt: new Date(),
            user: message.user,
            chatKey: chat.chatKey,
            heart: friend.heart,
            unread: unread
          }
          updates[`/lastMessages/${chat.user._id}/${message.user._id}`] = lastMessage;
          resolve(updates);
        });
      })
      .then((updates) =>{
        firebase.database().ref().update(updates);
      })
    })
    

    if(image){
      upload.uploadImage(image, 
        newMessageKey, 
        'messages', 
        message,
        `/chats/${chat.chatKey}/${newMessageKey}`
      );
    }
  })

  

  
  
    
};
