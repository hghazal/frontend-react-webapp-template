import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import configureStore from '../store/configureStore';
import getRoutes from '../routes';
import createHistory from 'react-router/lib/createMemoryHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

const history = useScroll(() => browserHistory)();
const rootElement = document.getElementById('reactAppRoot')

// Compile an initial state
const initialState = {}

// Create a new Redux store instance
const store = configureStore(initialState)


ReactDOM.render(
  <Provider store={store} key="provider">
    <Router history={history} children={getRoutes(store)} />
  </Provider>,
  rootElement
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger
  
  if (!rootElement || !rootElement.firstChild || !rootElement.firstChild.attributes || !rootElement.firstChild.attributes['data-react-checksum']) {
  console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}
//
// if (__DEVTOOLS__ && !window.devToolsExtension) {
//   const DevTools = require('./containers/DevTools/DevTools');
//   ReactDOM.render(
//     <Provider store={store} key="provider">
//       <div>
//         {component}
//         <DevTools />
//       </div>
//     </Provider>,
//     dest
//   );
// }
