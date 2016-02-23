import path from 'path'
import Express from 'express'
import compression from 'compression';
import qs from 'qs'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
// import webpackConfig from '../../webpack/dev'



import React from 'react'
import ReactDOM from 'react-dom/server';
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import Html from '../helpers/Html';

import { match } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';

import configureStore from '../store/configureStore'
// import App from '../containers/App'
// import App from '../client'
import config from '../config'
import getRoutes from '../routes';
// import { fetchCounter } from '../common/api/counter'

import inject_tap_event_plugin from 'react-tap-event-plugin'

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
inject_tap_event_plugin()

const app = new Express();
// Use this middleware to set up hot module reloading via webpack.
// const compiler = webpack(webpackConfig)
// // app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
// app.use(webpackHotMiddleware(compiler))

app.use(compression());

app.use((req, res) => {
  
  if (__DEVELOPMENT__) {
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
      
      // loadOnServer({...renderProps, store}).then(() => {
        
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};
        
        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      // });
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.listen(config.port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info('==> 🌎  Open brower to http://%s:%s/.', config.host, config.port)
  }
})
