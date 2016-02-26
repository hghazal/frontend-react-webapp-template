import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import BundleTracker from 'webpack-bundle-tracker';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import WebpackCleanupPlugin from 'webpack-cleanup-plugin'
import _debug from 'debug'

import config from '../config';
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

const debug = _debug('app:webpack-base-config')
const paths = config.utilsPaths
Object.assign(global, config.globals);

debug('Create base webpack configuration.')
const webpackBaseConfig = {
  context: config.pathBase,
  entry: [
    paths.src('client'),
  ],
  output: {
    // file name pattern for chunk scripts
		chunkFilename: '[name].[hash].js',
    // file name pattern for entry scripts
    filename: path.join('js', '[name].[hash].js'),
    // filesystem path for assets files
    path: paths.dist(),
    // webserver path for assets files
    publicPath: '/assets/'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: paths.src(),
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-0'],
          env: {
            development: {
              plugins: [
                ['react-transform', {
                  transforms: [{
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module']
                  }, {
                    transform: 'react-transform-catch-errors',
                    imports: ['react', 'redbox-react']
                  }]
                }]
              ]
            },
            production: {
              plugins: [
                'transform-react-remove-prop-types',
                'transform-react-constant-elements'
              ]
            }
          }
        }
      },
      {
        exclude: /node_modules/,
        loader: 'json-loader',
        test: /\.json$/
      },
      {
        loader: ExtractTextPlugin.extract('css!sass'),
        test: /\.scss$/
      },
      {
        loader: 'file?context=' + paths.base('assets') + '&hash=sha512&digest=hex&name=fonts/[name].[ext]',
        test:  /\.(woff|woff2|ttf|eot|svg)$/i
      },
      {
        loader: 'url-loader?limit=10240',
        test: webpackIsomorphicToolsPlugin.regular_expression('images')
      }
    ]
  },
  // maybe some kind of a progress bar during compilation
  progress: true,
  resolve: {
    fallback: [
      config.pathBase,
      paths.src(),
      // path.resolve(config.pathBase, 'node_modules'),
      // path.resolve(config.pathBase, 'assets')
    ],
    extensions: ['', '.js', '.jsx']
  }
}

// -----------------------------------------------------------------------------
// Entry Points
// -----------------------------------------------------------------------------

if (__DEV__) {
  webpackBaseConfig.entry = [
    `webpack-hot-middleware/client?path=http://${config.serverHost}:${config.serverPort+1}/__webpack_hmr`,
    'webpack/hot/only-dev-server',
  ].concat(webpackBaseConfig.entry)
}

// -----------------------------------------------------------------------------
// Plugins
// -----------------------------------------------------------------------------
webpackBaseConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin(),
  new ExtractTextPlugin('css/[name].css', {allChunks: true}),
];

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')
  webpackBaseConfig.plugins.push(
    // new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.HotModuleReplacementPlugin(),
    webpackIsomorphicToolsPlugin.development()
  )
} else if (__PROD__) {
  debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
  webpackBaseConfig.plugins.push(
    new WebpackCleanupPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    webpackIsomorphicToolsPlugin.development(false)
  )
}
// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackBaseConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor']
  }))
}

export default webpackBaseConfig
