import express from 'express';
import path from 'path';
import compression from 'compression';
import qs from 'qs'

import React from 'react'
import ReactDOM from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import { Provider } from 'react-redux'

import Html from '../helpers/Html';
import createHistory from 'react-router/lib/createMemoryHistory';

import configureStore from '../store/configureStore'
import favicon from 'serve-favicon';
import config from '../../config';
import getRoutes from '../routes';
import DevTools from '../containers/DevTools/DevTools';

// assign the global variables from the config file.
Object.assign(global, config.globals)

const paths = config.utils_paths
const app = new express();

app.use(favicon(path.join(__dirname, '..', '..', 'static', 'favicon.ico')));
app.use(compression());

if (__PROD__) {
  app.use('/assets', express.static(paths.dist()));
}

app.use((req, res) => {
  
  if (__DEV__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  
  // Read the counter from the request, if provided
  const params = qs.parse(req.query)
  const counter = parseInt(params.counter, 10) || 0
  
  // Compile an initial state
  const initialState = { counter: 0 }
  
  const history = createHistory(req.originalUrl);
  
  // Create a new Redux store instance
  const store = configureStore(initialState)

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }
  
  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }
  
  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      const devtools = __DEVTOOLS__ ? (<DevTools/>) : null
      const component = (
        <Provider store={store} key="provider">
          <div>
            <RouterContext {...renderProps} />
            {devtools}
          </div>
        </Provider>
      );

      res.status(200);

      global.navigator = {userAgent: req.headers['user-agent']};

      res.send('<!doctype html>\n' +
        ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.listen(config.server_port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Open brower to http://${config.server_host}:${config.server_port}/.`)
  }
})
