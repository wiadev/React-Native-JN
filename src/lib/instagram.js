import immutable from 'seamless-immutable';
import RNInstagramOAuth from 'react-native-instagram-oauth';

import config from '../config';



 

const LOAD_INSTAGRAM = 'Juno.profile.LOAD_INSTAGRAM';
const LOAD_INSTAGRAM_SUCCESS = 'Juno.profile.LOAD_INSTAGRAM_SUCCESS';
const LOAD_INSTAGRAM_ERROR = 'Juno.profile.LOAD_INSTAGRAM_ERROR';

//const LOAD_INSTAGRAM_TOKEN_SUCCESS = 'Juno.profile.LOAD_INSTAGRAM_SUCCESS';
//const LOAD_INSTAGRAM_TOKEN_ERROR = 'Juno.profile.LOAD_INSTAGRAM_TOKEN_ERROR';


const initialState = immutable({
  photos: [],
  loading: false,
  error: null
});



export default function instagram(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_INSTAGRAM:
      return state.merge({
        loading: true,
        photos: []
      });
    case LOAD_INSTAGRAM_SUCCESS:
      return state.merge({
        loading: false,
        photos: action.photos
      });
    case LOAD_INSTAGRAM_ERROR:
      return state.merge({
        loading: false,
        error: action.error
      });
    default:
      return state;
  }
}

/*
export const loginWithInstagram = () => dispatch => {

  RNInstagramOAuth(config.instagram.client_id, config.instagram.redirect_url, (err, access_token) => {
    if (err) { console.log(err) }
    if (access_token !== undefined) {
      console.log('access_token.instagram',access_token);


      var request = new XMLHttpRequest();
      request.onreadystatechange = (e) => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          console.log('success', request.responseText);
          
          var data = JSON.parse(request.responseText);
          console.log(data);
          dispatch({ type: LOAD_INSTAGRAM_TOKEN_SUCCESS, data});
        } else {
          dispatch({ type: LOAD_INSTAGRAM_TOKEN_ERROR, error });
        }
      };
      console.log('https://api.instagram.com/v1/users/self/?access_token='+access_token);
      request.open('GET', 'https://api.instagram.com/v1/users/self/?access_token='+access_token);

      request.send();

    }
 });
};*/

export const loadInstagram = (username) => dispatch => {
  dispatch({ type: LOAD_INSTAGRAM });

  return fetch(`https://www.instagram.com/${username}/media/`)
    .then(response => response.json())
    .then(data => {
      if (data && data.items && data.items.length) {
        const photos = data.items.map(post => post.images.low_resolution.url);
        dispatch({ type: LOAD_INSTAGRAM_SUCCESS, photos });
      } else {
        throw new Error("User's Instagram is Private");
      }
    })
  .catch(error => dispatch({ type: LOAD_INSTAGRAM_ERROR, error: error.message }));
};

export const getPhotos = (state) => state.instagram.photos;
export const getUsername = (state) => state.instagram.username;
export const getLoading = (state) => state.instagram.loading;
export const getError = (state) => state.instagram.error;
