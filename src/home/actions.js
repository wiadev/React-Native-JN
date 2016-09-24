import * as firebase from 'firebase';
import * as types from './actionTypes';
import { ActionSheetIOS, Alert } from 'react-native';
import * as constants from './constants';
import config from '../config';
import screens from '../screens';
import { Colors } from '../UI';
import immutable from 'seamless-immutable';
import _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob';
import { sendNotification }  from './../notifications/actions';


const LOAD_POSTS = 'Juno.Post.LOAD_POSTS';
const LOAD_POSTS_SUCCESS = 'Juno.Post.LOAD_POSTS_SUCCESS';
const LOAD_POSTS_ERROR = 'Juno.Post.LOAD_POSTS_ERROR';


export const changeFeed = (feed) => dispatch =>  {
  dispatch({ type: types.CHANGE_FEED, feed })
  console.log('changefeed', feed)
  loadPosts()

};
export const toggleFilter = () => ({ type: types.TOGGLE_FILTER });

export const goToPost = (post, navigator) => dispatch => {
  navigator.showModal({
    screen: screens.post,
    titleImage: require('../img/LogoHeaderColor.png'),
    passProps: { post },
    navigatorStyle: {
      navBarTextColor: Colors.secondary,
      navBarButtonColor: Colors.primary,
    }
  });
};

const initialState = immutable({
  posts: [],
  loading: false,
  error: null
});

export default function homePost(state = initialState, action = {}) {
  switch (action.type) {
    
    case LOAD_POSTS:
      return state.merge({
        loading: true,
        posts: []
      });
    case LOAD_POSTS_SUCCESS:
      return state.merge({
        loading: false,
        posts: action.posts
      });
    case LOAD_POSTS_ERROR:
      return state.merge({
        loading: false,
        posts: []
      });
    default:
      return state;
  }
}

export const stopRetrievingData = () => (dispatch, getState) => {
  console.log('stopRetrievingData');

  const user = getState().currentUser;
  const database = firebase.database();

  database.ref(`/notifications/${user._id}`).off('value');
  database.ref(`/allPosts`).off('value');

  database.ref(`/lastMessages/${user._id}`).off('value');
  database.ref(`/blocks/${user._id}`).off('value');
  database.ref(`/friends/${user._id}`).off('value');
  
}


export const loadPosts = (feed, filterId, limit=2) => (dispatch, getState) => {
  dispatch({ type: LOAD_POSTS });
  
  const user = getState().currentUser;

  let ref = firebase.database().ref(`/allPosts`)
  
  if(feed && feed.feed && feed.feed != 'world' )
    ref = ref.orderByChild("feed").startAt(feed.feed).endAt(feed.feed);
  
  ref.on("value", (snapshot) => {
    let posts =  _.map(snapshot.val(), (obj) => obj);
    //let posts =  _.filter(snapshot.val(), (obj) => users.indexOf(obj.user._id) === -1);
    if(filterId === 'hot')
      posts = _.orderBy(posts, ['counter'], ['desc']);
    else
      _.reverse(posts);
    
    dispatch({ type: LOAD_POSTS_SUCCESS, posts});
    
  }, (error) => {
     dispatch({ type: LOAD_POSTS_ERROR, error: error});
  })

};


export const getPosts = (state) => { return state.homePost.posts; };
export const getLoading = (state) => state.homePost.loading;
export const hasMore = (state) => state.homePost.more;

export const goToUser = (user, navigator) => dispatch => {
  navigator.showModal({
    screen: screens.profile,
    title: 'Profile',
    passProps: { user },
    navigatorStyle: {
      navBarTextColor: Colors.white,
      navBarButtonColor: Colors.white,
      navBarBackgroundColor: Colors.secondary,
      navBarNoBorder: true,
      statusBarTextColorScheme: 'light'
    }
  });
};

export const goToOwnPosts = (type, navigator) => (dispatch, getState) => {
  const user = getState().currentUser;
  navigator.showModal({
    screen: screens.myPosts,
    title: type === 'comments' ? 'My Comments' : 'My Posts',
    passProps: { user, type },
    navigatorStyle: {
      navBarTextColor: Colors.secondary,
      navBarButtonColor: Colors.primary,
    }
  });
};


export const goToOwnComments = (navigator) => (dispatch, getState) => {
  const user = getState().currentUser;
  navigator.showModal({
    screen: screens.myComments,
    title: 'My Comments',
    passProps: { user},
    navigatorStyle: {
      navBarTextColor: Colors.secondary,
      navBarButtonColor: Colors.primary,
    }
  });
};


export const goToSettings = (navigator) => dispatch => {
  navigator.showModal({
    screen: screens.settings,
    title: 'Settings',
    navigatorStyle: {
      navBarTextColor: Colors.secondary,
      navBarButtonColor: Colors.primary,
    }
  });
};

export const goToCreatePost = (navigator) => dispatch => {
  navigator.showModal({
    screen: screens.createPost,
    titleImage: require('../img/LogoHeaderColor.png'),
    navigatorStyle: {
      navBarTextColor: Colors.secondary,
      navBarButtonColor: Colors.primary,
    }
  });
};

export const onPostOptionsPress = (post) => (dispatch, getState) => {

  const user = getState().currentUser;

  const isOwnPost = user._id === post.user._id;

  if (isOwnPost) {
    return dispatch(sharePost(post));
  }

  // share logic
  ActionSheetIOS.showActionSheetWithOptions({
    options: constants.POST_OPTIONS,
    cancelButtonIndex: constants.CANCEL_INDEX,
    destructiveButtonIndex: constants.BLOCK_INDEX
  }, (buttonIndex) => {
    if (buttonIndex === constants.SHARE_INDEX) {
      dispatch(sharePost(post));
    } else if (buttonIndex === constants.REPORT_INDEX) {
      dispatch(reportPost(post, user));
    } else if (buttonIndex === constants.BLOCK_INDEX) {
      dispatch(blockUser(user, {_id: post.user._id, name: post.user.name, avatar: post.user.avatar}));
    }
  });
};

export const onCommentOptionsPress = (comment) => (dispatch, getState) => {

  const user = getState().currentUser;
  const isOwnComment = user._id === comment.user._id;


  if (isOwnComment) {
    ActionSheetIOS.showActionSheetWithOptions({
      options: constants.OWN_COMMENT_OPTIONS,
      cancelButtonIndex: constants.OWN_COMMENT_CANCEL_INDEX,
      destructiveButtonIndex: constants.OWN_COMMENT_DELETE_INDEX
    }, (buttonIndex) => {
      if (buttonIndex === constants.OWN_COMMENT_DELETE_INDEX) {
        dispatch(deleteComment(comment));
      }
    });
  } else {
    ActionSheetIOS.showActionSheetWithOptions({
      options: constants.COMMENT_OPTIONS,
      cancelButtonIndex: constants.COMMENT_CANCEL_INDEX,
      destructiveButtonIndex: constants.COMMENT_BLOCK_INDEX
    }, (buttonIndex) => {
      if (buttonIndex === constants.COMMENT_REPORT_INDEX) {
        dispatch(reportPost(comment, user));
      } else if (buttonIndex === constants.COMMENT_BLOCK_INDEX) {
        dispatch(blockUser(user, { _id: comment.user._id, name: comment.user.name, avatar: comment.user.avatar }));
      }
    });
  }
};

export const deleteComment = (comment) => dispatch => {
  dispatch({ type: types.DELETE_COMMENT, comment });

  firebase.database().ref(`/comments/${comment._id}`).remove();
  const postRef = firebase.database().ref(`/allPosts/${comment.post_id}`);

  postRef.once('value', (snapshot) =>{
    const post = snapshot.val();
    postRef.update({comments: parseInt(post.comments)-1 })
  });
  // delete comment logic
};


export const reportPost = (post, currentUser) => dispatch => {
  dispatch({ type: types.REPORT_POST, post });
  // report logic

  const current = {
    _id: currentUser._id ,
    avatar: currentUser.avatar,
    name: currentUser.name
  };
  let updates = {};
  updates[`/reports/${post._id}/${currentUser._id}`] = {user: current, createdAt: Date.now()};
  
  firebase.database().ref().update(updates)
  
  Alert.alert('Post is reported !');
  //sendNotification(currentUser.name +' just blocked you!', '', user._id);
};

export const blockUser = (currentUser, user) => dispatch => {

  let userId = user._id;
  dispatch({ type: types.BLOCK_USER, userId });

  let refBlock = firebase.database().ref(`/blocks/${currentUser._id}/${user._id}`)
  
  refBlock.once("value", function(snapshot) {
    if(!snapshot.exists()){

      const current = {
        _id: currentUser._id ,
        avatar: currentUser.avatar,
        name: currentUser.name
      };

      let updates = {};
      updates[`/blocks/${currentUser._id}/${user._id}`] = {user: user, blockedAt: Date.now()};
      updates[`/blocks/${user._id}/${currentUser._id}`] = {user: current, blockedAt: Date.now()};
      
      firebase.database().ref(`/friends/${currentUser._id}/${user._id}`).remove()
      firebase.database().ref(`/friends/${user._id}/${currentUser._id}`).remove()
      firebase.database().ref(`/lastMessages/${currentUser._id}/${user._id}`).remove()
      firebase.database().ref(`/lastMessages/${user._id}/${currentUser._id}`).remove()
      firebase.database().ref().update(updates)
      
      Alert.alert(user.name +' is blocked !');
    }

  })

};

export const updateToken = (userId, token) => dispatch => {
  let updates = {};
  // store fcm token in firebase (users tables)
  updates[`/users/${userId}/token`] = token;
  firebase.database().ref().update(updates)
};



export const sharePost = (post) => dispatch => {
  dispatch({ type: types.SHARE_POST, post });


  const fs = RNFetchBlob.fs
  if(post.image){

    RNFetchBlob
    .config({ 
          fileCache : true 
     })
    .fetch('GET', post.image)
    // the image is now dowloaded to device's storage
    .then((res) => {
        // the image path you can use it directly with Image component
        return  res.path()

    })
    .then((base64Data) => {

        ActionSheetIOS.showShareActionSheetWithOptions({
          url: base64Data,
          message: post.text
        },
        (error) => Alert.alert(error.message),
        (success, method) => {
          // callback sucess
        });
    })  
  }
  else{
    ActionSheetIOS.showShareActionSheetWithOptions({
      message: post.text
    },
    (error) => Alert.alert(error.message),
    (success, method) => {
      // callback sucess
    });
  }
  
};

export const upLike = (post, comment) => (dispatch, getState) => {
  //dispatch({ type: types.UP_LIKE, post || comment });

  const user = getState().currentUser;

  if(!comment)
    updatePost(post, user, 'likes');
  else
    updateComment(comment, user, 'likes');    
  
};

export const upUnlike = (post, comment) => (dispatch, getState) => {
  //dispatch({ type: types.UP_UNLIKE, post || comment });

  const user = getState().currentUser;
    
  if(!comment)
    updatePost(post, user, 'unlikes');
  else
    updateComment(comment, user, 'unlikes');
  
};

export const didup = (obj) => (dispatch, getState) => {
  const user = getState().currentUser;
  console.log('ownProps.unlikes', obj);
  return obj.indexOf(user._id) > -1;
}


export const updatePost = (post, user, type) => {
  let changetype = type == 'likes' ? 'unlikes' : 'likes';

  let porstRef = firebase.database().ref(`/allPosts/${post._id}`)
  
  let ref1 = porstRef.child(`/${type}/${user._id}`)
  let ref2 = porstRef.child(`/${changetype}/${user._id}`)

  new Promise((resolve, reject) => {
    updatePoint(ref1, ref2, post.user._id, 1, type, resolve);
  })
  .then(() => {
    porstRef.once('value', (s) => {
      let post = s.val();
      let counter = 
        (post.likes ? Object.keys(post.likes).length : 0) 
          - 
        (post.unlikes ? Object.keys(post.unlikes).length : 0);

      if(counter != -6)
        porstRef.update({counter: counter})
      else
        porstRef.remove();
    })
  })
  
    
}

export const updateComment= (comment, user, type) => {

  let changetype = type == 'likes' ? 'unlikes' : 'likes';
  let commentRef = firebase.database().ref(`/comments/${comment._id}`)

  
  let ref1 = commentRef.child(`/${type}/${user._id}`)
  let ref2 = commentRef.child(`/${changetype}/${user._id}`)

  new Promise((resolve, reject) => {
    updatePoint(ref1, ref2, comment.user._id, 5 , type, resolve);
  })
  .then(() => {
    commentRef.once('value', (s) => {
      let comment = s.val();
      let counter = 
        (comment.likes ? Object.keys(comment.likes).length : 0) 
          - 
        (comment.unlikes ? Object.keys(comment.unlikes).length : 0);

      if(counter == -6)
        commentRef.remove();
    })
  })
  
}

export const updatePoint = (ref1, ref2, userId, point, type , callback) => {
  let liked = false , unliked = false;
  ref1.once('value', (snapshot) => {
    if(snapshot.val())
      liked = true;
  })

  ref2.once('value', (snapshot) => {
    if(snapshot.val())
      unliked = true;
  })

  if(type === 'likes' && liked || type === 'unlikes' && liked)
    ref1.remove();

  else{
    ref1.set(1);
    ref2.remove();
  }

  let clicked = unliked || liked;
  
  op = clicked ? (type === 'unlikes' && liked ? 0 :  ( type === 'likes' && unliked ) ? 1 :  -1) : (type === 'unlikes' ? 0 : 1);


  if(op != 0){
    let userRef = firebase.database().ref(`/users/${userId}`)
    userRef.once('value', (s) => {
      let user = s.val();
      userRef.update({reputation: parseInt(user.reputation|| 0) + (op*point) })
    })
  }
    

  
  if(callback) callback();
}
