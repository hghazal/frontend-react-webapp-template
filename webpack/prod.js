var Express = require('express');
var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

var webpackBaseConfig = require('./webpack-base-config');
var app_config = require('../src/config');

var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
const config = webpackBaseConfig;//Object.clone(webpackBaseConfig);

var host = webpackBaseConfig.host || 'localhost';
var port = (webpackBaseConfig.port + 1) || 3001;
config.output.publicPath = '//' + host + ':' + port + config.output.publicPath

config.plugins = config.plugins.concat(
  webpackIsomorphicToolsPlugin,
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      comparisons: false,
      'dead_code': true,
      'drop_console': true,
      'drop_debugger': true,
      unsafe: true,
      'unsafe_comps': true,
      warnings: false
    },
    screwIE8: true,
  }),
  // new ExtractTextPlugin('styles.[hash].css')
);

config.module.loaders.concat(
  {
    test: /\.(js|jsx)$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    include: config.pathConfig.src
  }
);


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
