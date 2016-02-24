#!/usr/bin/env node

require('./server.babel'); // babel registration (runtime transpilation for node)
var config = require('../../config').default;

if (config.globals.__DEV__) {
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
    return;
  }
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../../webpack/webpack-isomorphic-tools'))
  .development(config.globals.__DEV__)
  .server(config.path_base, function() {
    require('./server');
  });
