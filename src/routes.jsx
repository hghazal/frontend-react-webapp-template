import React from 'react';
import {IndexRoute, Route} from 'react-router';
// import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';

import {
  Root,
  Home,
  Demo,
} from '../src/containers';


export default (store) => {
  return (
    <Route name="root" path="/">
      <IndexRoute component={ Root } />
      <Route path="demo" name="demo" component={ Demo } />
    </Route>
  );
}
