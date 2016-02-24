/* eslint key-spacing:0 spaced-comment:0 */
import _debug from 'debug';
import path from 'path';

// config.path_base
// path.join(config.path_base, config.dir_src)
// path.join(config.path_base, config.dir_dist)

const debug = _debug('app:config:_base');
const config = {
  env : process.env.NODE_ENV || 'development',
  
  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_src    : 'src',
  dir_dist   : 'dist',
  dir_test   : 'tests',
  
  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : process.env.HOST || 'localhost',
  server_port : parseInt(process.env.PORT, 10) || 3000,

}

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
    'NODE_ENV' : JSON.stringify(config.env)
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
}

// ------------------------------------
// Utilities
// ------------------------------------
config.utils_paths = (() => {
  const resolve = path.resolve

  const base = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args])

  return {
    base   : base,
    src    : base.bind(null, config.dir_src),
    dist   : base.bind(null, config.dir_dist)
  }
})()

export default config;
