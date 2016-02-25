/* eslint key-spacing:0 spaced-comment:0 */
import _debug from 'debug';
import path from 'path';

const debug = _debug('app:config:_base');
const config = {
  env : process.env.NODE_ENV || 'development',
  
  // ----------------------------------
  // Project Structure
  // ----------------------------------
  pathBase  : path.resolve(__dirname, '..'),
  dirSrc    : 'src',
  dirDist   : 'dist',
  dirTest   : 'tests',
  
  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  serverHost : process.env.HOST || 'localhost',
  serverPort : parseInt(process.env.PORT, 10) || 3000,
  
  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler: {
    quiet                     : true,
    hashType                  : 'hash',
    stats: {
      // chunks : false,
      // chunkModules : false,
      colors : true,
    },
  },
  compilerVendor : [
    'history',
    'react',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
  ],
};

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env),
  },
  'NODE_ENV'        : config.env,
  '__DEV__'         : config.env === 'development',
  '__PROD__'        : config.env === 'production',
  '__TEST__'        : config.env === 'test',
  // DISABLE SERVER SIDE RENDERING FOR ERROR DEBUGGING
  '__DISABLE_SSR__' : false,
  // ENABLE/DISABLE REDUX DEV TOOLS
  '__DEVTOOLS__'    : config.env === 'development',
  '__BASENAME__'    : JSON.stringify(process.env.BASENAME || ''),
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');

config.compilerVendor = config.compilerVendor
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true;

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from vendor_dependencies in ~/config/index.js`
    );
  });


// ------------------------------------
// Utilities
// ------------------------------------
config.utilsPaths = (() => {
  const resolve = path.resolve;

  const base = (...args) =>
    resolve.apply(resolve, [config.pathBase, ...args]);

  return {
    base   : base,
    dist   : base.bind(null, config.dirDist),
    src    : base.bind(null, config.dirSrc),
  };
})();

export default config;
