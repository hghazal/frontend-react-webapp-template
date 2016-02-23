var Express = require('express');
var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

var webpackBaseConfig = require('./webpack-base-config');
var app_config = require('../src/config');

var host = webpackBaseConfig.host || 'localhost';
var port = (webpackBaseConfig.port + 1) || 3001;
const config = webpackBaseConfig;//Object.clone(webpackBaseConfig);

config.devltool = 'inline-source-map';

config.plugins = config.plugins.concat(
  new webpack.IgnorePlugin(/webpack-stats\.json$/),
  new webpack.DefinePlugin({
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
  }),
  // faster code reload on changes
  new webpack.HotModuleReplacementPlugin(),
  webpackIsomorphicToolsPlugin.development()
);

config.entry = [
  // 'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
  'webpack-hot-middleware/client',
  'webpack/hot/only-dev-server',
].concat(config.entry)

config.module.loaders = [
  {
    test: /\.(js|jsx)$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    include: config.pathConfig.src,
    query: {         presets: [ 'react-hmre' ]}
    
  }
].concat(config.module.loaders);

config.output.publicPath = '//' + host + ':' + port + config.output.publicPath

var serverOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

var compiler = webpack(config);
var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));


app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err.stack || error);
    throw error
  }
  console.info('==> 🚧  Webpack development server listening on port %s', port);
});

// webpackIsomorphicToolsPlugin.development(true).server(config.pathConfig.root, function() {
//   require('./src/server');
// });
