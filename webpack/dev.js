import Express from 'express';
import webpack from 'webpack';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import webpackBaseConfig from './webpack-base-config';
import config from '../config';
const {__DEV__, __PROD__, __DEVTOOLS__} = config.globals


var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
var host = config.server_host;
var port = config.server_port + 1;
const webpackConfig = webpackBaseConfig;//Object.clone(webpackBaseConfig);

webpackConfig.devltool = 'inline-source-map';
webpackConfig.output.publicPath = `//${host}:${port}${webpackConfig.output.publicPath}`

var serverOptions = {
  contentBase: `http://${host}:${port}`,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

var compiler = webpack(webpackConfig);
var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));


app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err.stack || error);
    throw error
  }
  console.info(`==> 🚧  Webpack development server listening on port ${port}`);
});
