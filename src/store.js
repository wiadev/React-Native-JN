/**
 * Created by hammadjutt on 2016-04-30.
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import reducers from './rootReducer';
import config from './config';
import * as storage from 'redux-storage'

const reducer = storage.reducer(reducers);
import createEngine from 'redux-storage-engine-localstorage';
const engine = createEngine('juno-app');
const storageMiddleware = storage.createMiddleware(engine);

const createStoreWithMiddleware = (
  config.runRemoteDev ?
    compose(
      applyMiddleware(thunk, storageMiddleware),
      devTools(config.remoteDev)
    )(createStore)
  :
    compose(
      applyMiddleware(thunk, storageMiddleware),
    )(createStore)
);

export const store = createStoreWithMiddleware(reducer);

const load = storage.createLoader(engine);
load(store);

load(store)
.then((newState) => console.log('Loaded state:', newState))
.catch(() => console.log('Failed to load previous state'));
