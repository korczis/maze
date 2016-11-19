import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import auth from './auth';
import clients from './clients';
import game from './game';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,

  // Real reducer modules
  auth,
  clients,
  game
});
