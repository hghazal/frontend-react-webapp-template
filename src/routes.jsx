import React from 'react';
import {IndexRoute, Route} from 'react-router';
// import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';

import {
  Root,
  Home,
} from '../src/containers';


export default (store) => {
  return (
    <Route path="/" component={Root}>
      <IndexRoute component={Home} />
    </Route>
  );
}
