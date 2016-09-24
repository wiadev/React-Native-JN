import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
import immutable from 'seamless-immutable';

const LOAD_FRIENDS = 'Juno.profile.LOAD_FRIENDS';
const LOAD_FRIENDS_SUCCESS = 'Juno.profile.LOAD_FRIENDS_SUCCESS';
const LOAD_FRIENDS_ERROR = 'Juno.profile.LOAD_FRIENDS_ERROR';

const initialState = immutable({
  friends: [],
  loading: false,
  error: null
});

export default function facebook(state = initialState, action = {}) {	
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
        error: action.error
      });
    default:
      return state;
  }
}

export const loadFriends = () => dispatch => {
    dispatch({ type: LOAD_FRIENDS });
    
 
     const infoRequest = new GraphRequest(
      '/me/taggable_friends',
      null,
      function(error, result){
       if (error) {
           dispatch({ type: LOAD_FRIENDS_ERROR, error: 'error load friends from facebook' })
         } else {
           const friends = result.data;
           console.log('friends',friends);
           dispatch({ type: LOAD_FRIENDS_SUCCESS, friends });
         }
      },
    );
    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start();
};

export const getFriends = (state) => { return state.facebook.friends};
export const getLoading = (state) => state.facebook.loading;
export const getError = (state) => state.facebook.error;