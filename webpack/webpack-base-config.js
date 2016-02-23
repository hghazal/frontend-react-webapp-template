var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BundleTracker = require('webpack-bundle-tracker');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));


var rootFolder = path.resolve(__dirname, '..')
var pathConfig = {
  root: rootFolder,
  src: path.resolve(rootFolder, 'src'),
  dist: path.resolve(rootFolder, 'dist/assets')
}

module.exports = {
  pathConfig: pathConfig,
  context: pathConfig.root,
  entry: [
    './src/client'
  ],
  output: {
    // file name pattern for chunk scripts
		chunkFilename: '[name].[hash].js',
    // file name pattern for entry scripts
    filename: path.join('js', '[name].[hash].js'),
    // filesystem path for static files
    path: pathConfig.dist,
    // webserver path for static files
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      // {
      //   test: /\.(js|jsx)$/,
      //   loader: 'babel',
      //   exclude: /node_modules/,
      //   include: pathConfig.src,
      //   query: {
      //     presets: [ 'react-hmre' ]
      //   }
      // },
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
        loader: 'file?context=' + path.join (__dirname, '..', 'static') + '&hash=sha512&digest=hex&name=[path][name].[ext]',
        test:  /\.(woff|woff2|ttf|eot|svg)$/i
      },
      {
        loaders: [
            'file?context=' + path.join (__dirname, '..', 'static') + '&hash=sha512&digest=hex&name=[path][name]-[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=3&interlaced=false'
        ],
        test: /\.(jpe?g|png|gif)$/i
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
      path.resolve(__dirname, '..'),
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'node_modules'),
      path.resolve(__dirname, '..', 'static')
    ],
    extensions: ['', '.js', '.jsx']
  }
}
