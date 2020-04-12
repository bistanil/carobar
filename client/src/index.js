import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import App from './App';
import { createStore, combineReducers } from 'redux';
import LoginReducer from './states/LoginReducer';
import CarReducer from './states/CarReducer';
import { applyMiddleware  } from 'redux'
import { Provider } from 'react-redux';
import axios from 'axios';

let reducers = combineReducers({
  login:LoginReducer,
  cars: CarReducer
})

const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

const store = createStore(
  reducers,
  // compose(
  applyMiddleware(logger),
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
);

axios.defaults.baseURL = 'http://localhost:5000'
axios.interceptors.request.use(function (config) {
  const token = store.getState().login.token;
  config.headers.Authorization =  token;
  // if (401 === error.response.status) {

  // }
  return config;
});

axios.interceptors.response.use(function (response) {
  console.log('Response', response);
  return response;
}, function (error) {
  console.log('Error', error.response);
  if (403 === error.response.status) {
    localStorage.removeItem('_carobar_');
    store.dispatch({type:'logout'})
  } else {
    return Promise.reject(error);
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));

serviceWorker.unregister();
