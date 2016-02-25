import Express from 'express';
import webpack from 'webpack';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import webpackBaseConfig from './webpack-base-config';
import config from '../config';

Object.assign(global, config.globals);


var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
var host = config.serverHost;
var port = config.serverPort + 1;
const webpackConfig = webpackBaseConfig;//Object.clone(webpackBaseConfig);

webpackConfig.devltool = 'inline-source-map';
webpackConfig.output.publicPath = `//${host}:${port}${webpackConfig.output.publicPath}`

var serverOptions = {
  contentBase: `http://${host}:${port}`,
  quiet: config.compiler.quiet,
  noInfo: config.compiler.quiet,
  hot: true,
  lazy: false,
  inline: true,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: config.compiler.stats
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
