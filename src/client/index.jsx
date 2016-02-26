import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import configureStore from 'src/store/configure-store';
import getRoutes from 'src/routes';
import createHistory from 'react-router/lib/createMemoryHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import DevTools from 'src/containers/dev-tools/dev-tools';


const history = useScroll(() => browserHistory)();
const rootElement = document.getElementById('reactAppRoot')

// Compile an initial state
const initialState = {}

// Create a new Redux store instance
const store = configureStore(initialState)



if (!__PROD__) {
  window.React = React; // enable debugger
  if (!rootElement || !rootElement.firstChild || !rootElement.firstChild.attributes || !rootElement.firstChild.attributes['data-react-checksum']) {
  console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}


const devtools = __DEVTOOLS__ ? (<DevTools/>) : null

ReactDOM.render(
  <Provider store={store} key="provider">
    <div>
      <Router history={history} children={getRoutes(store)} />
      {devtools}
    </div>
  </Provider>,
  rootElement
);
