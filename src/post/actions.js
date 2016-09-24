import screens from '../screens';
import { Colors } from '../UI';
import * as firebase from 'firebase';
import * as upload from '../lib/upload';

import { sendNotification }  from './../notifications/actions';
import immutable from 'seamless-immutable';
import _ from 'lodash'

const initialState = immutable({
  messages: [],
  chats: [],
  loadingMessages: false,
  loadingChats: false,
  error: null
});

const LOAD_POST = 'Juno.Post.LOAD_POST';
const LOAD_POST_SUCCESS = 'Juno.Post.LOAD_POST_SUCCESS';
const LOAD_POST_ERROR = 'Juno.Messages.LOAD_POST_ERROR';

const LOAD_COMMENT_SUCCESS = 'Juno.Messages.LOAD_COMMENT_SUCCESS';
const IS_HOME_FEED = 'Juno.Messages.IS_HOME_FEED';



export default function posts(state = initialState, action = {}) {
  switch (action.type) {
    
    case LOAD_POST:
      return state.merge({
        loading: true,
        post: null,
        comments: [],
        isHomeFeed: false
      });
    case LOAD_POST_SUCCESS:
      return state.merge({
        post: action.post
      });
    case LOAD_COMMENT_SUCCESS:
      return state.merge({
        loading: false,
        comments: action.comments
      });
    case LOAD_POST_ERROR:
      return state.merge({
        loading: false,
        posts: []
      });
    case IS_HOME_FEED:
      return state.merge({
        isHomeFeed: action.isHomeFeed,
        loading: false
      });
    default:
      return state;
  }
}

export const stopLoad = (post) => (dispatch) => {

  firebase.database().ref(`/comments`).orderByChild('post_id').equalTo(post._id).off('value')
  firebase.database().ref(`/allPosts/${post._id}`).off('value');
  
}

export const loadPost = (post) => (dispatch, getState) => {
  let postKey = post._id;
  if(postKey){

    let user = getState().currentUser;
    firebase.database().ref(`/allPosts/${postKey}`)
    .on('value', (snapshot) => {
      let post = snapshot.val();  

      const isHomeFeed = post &&  user.universityFeed ===  post.feed;  

      dispatch({ type: LOAD_POST_SUCCESS, post});
      dispatch({ type: IS_HOME_FEED, isHomeFeed});
    })  

    
  }

}
export const loadComments = (post) => (dispatch, getState) => {
   firebase.database().ref(`/comments`)
   .orderByChild('post_id').equalTo(post._id)
   .on('value', (snapshot) => {
     let comments=  _.map(snapshot.val(), (obj) => obj);

     console.log('commentscomments', comments)
     dispatch({ type: LOAD_COMMENT_SUCCESS, comments});
     
   }) 
}




export const getPost = (state) => state.posts.post;
export const getLoading = (state) => state.posts.loading;
export const getComments = (state) => state.posts.comments;
export const isHomeFeed = (state) => state.posts.isHomeFeed;


export const postComment= (data, post) => (dispatch, getState) => {
  
  let currentUser = getState().currentUser

  const { _id, avatar, name } = currentUser

  
  let newCommentKey = firebase.database().ref().child('comments').push().key;
  let postKey = post._id;


  const commentData = {
    _id: newCommentKey,
    text: data.text,
    createdAt: Date.now(),
    user: {
      _id: _id,
      avatar: avatar,
      name: name
    },
    post_id: postKey,
    likes: {},
    unlikes: {}
  }
  
  let updates = {};
  let refPost= firebase.database().ref(`/allPosts/${postKey}`)
  
  
  new Promise((resolve, reject) => {
    refPost.once("value", function(snapshot) {  
      let post = snapshot.val();
      
      updates[`/allPosts/${postKey}/comments`] = post.comments +1;
      updates[`/comments/${newCommentKey}`] = commentData;
      firebase.database().ref().update(updates);  

    })
  })
  .then(() => {
    if(data.image){
      upload.uploadImage(data.image, 
        newCommentKey, 
        'comments', 
        commentData,
        `/comments/${newCommentKey}`
      );
    }
      
  })

  if(post.user._id != _id)
    sendNotification(name+ ' commented on your post', commentData.text, post.user._id, 'comment',post)
  
  return true;
  

}







