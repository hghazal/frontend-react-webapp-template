import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'src/reducers';
import DevTools from 'src/containers/dev-tools/dev-tools';


const enhancer = compose(
  // Middleware you want to use in development:
  // applyMiddleware(d1, d2, d3),
  
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  applyMiddleware(thunk)
);

export default function configureStore(initialState) {
  let store = null;
  if (__DEVTOOLS__) { // eslint-disable-line no-undef
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
