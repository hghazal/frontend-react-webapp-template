import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools/DevTools';


const enhancer = compose(
  // Middleware you want to use in development:
  // applyMiddleware(d1, d2, d3),
  
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  // persistState(getDebugSessionKey()),
  applyMiddleware(thunk)
);

// function getDebugSessionKey() {
//   // You can write custom logic here!
//   // By default we try to read the key from ?debug_session=<key> in the address bar
//   const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
//   return (matches && matches.length > 0)? matches[1] : null;
// }

export default function configureStore(initialState) {
  let store = null;
  if (__DEVTOOLS__) {
    store = createStore(
      rootReducer,
      initialState,
      enhancer
    );
  } else {
    store = createStore( rootReducer,
      initialState,
      applyMiddleware(thunk)
    );
  }

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers') /* .default if you use Babel 6+ */)
    );
  }

  return store;
}
