import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import App from './App';
import { createStore } from 'redux';
import LoginReducer from './states/LoginReducer';
import { Provider } from 'react-redux';


const store = createStore(
  LoginReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));

serviceWorker.unregister();
