import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { throttle } from 'throttle-debounce';
// import 'typeface-roboto';
// import 'typeface-roboto-condensed';
import {
  fetchData, fetchRefsData, fetchNetworkData, windowResize
} from './actions';
import { ui } from './constants';

import './assets/index.css';
import './assets/ageSlider.css';
import './assets/networkGraph.css';
import './assets/icons/style.css';
import App from './App';
import reducers from './reducers';
// import registerServiceWorker from './registerServiceWorker';
import * as serviceWorker from './serviceWorker';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store;

if (process.env.NODE_ENV !== 'production') {
  store = createStore(
    reducers,
    // { initial state... },
    composeEnhancer(applyMiddleware(thunkMiddleware, createLogger()))
  );
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(reducers);
    });
  }
} else {
  store = createStore(
    reducers,
    // { initial state... },
    composeEnhancer(applyMiddleware(thunkMiddleware))
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./App', () => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root'));
  });
}

// TODO: move this to the filtering components to call fetchData when filters are updated
// for now, while designing the vis components, this is a fixed source
store.dispatch(fetchData('events.json'));
store.dispatch(fetchRefsData('refs.json'));
store.dispatch(fetchNetworkData('orfi.json'));

const resize = () => {
  store.dispatch(windowResize({
    height: window.innerHeight,
    width: window.innerWidth,
    appWidth: Math.min(ui.maxWidth, window.innerWidth),
    appLeft: (window.innerWidth - Math.min(ui.maxWidth, window.innerWidth)) / 2
  }));
};

// triger resize at beginning
resize();

// listen for future resizes (throttled)
window.addEventListener('resize', throttle(300, () => {
  resize();
}));

// registerServiceWorker();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
