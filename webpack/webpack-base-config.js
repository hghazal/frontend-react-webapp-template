import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import BundleTracker from 'webpack-bundle-tracker';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import config from '../config';

var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

module.exports = {
  context: config.path_base,
  entry: [
    './src/client'
  ],
  output: {
    // file name pattern for chunk scripts
		chunkFilename: '[name].[hash].js',
    // file name pattern for entry scripts
    filename: path.join('js', '[name].[hash].js'),
    // filesystem path for static files
    path: path.join(config.path_base, config.dir_dist),
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
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: path.join(config.path_base, config.dir_src),
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
      config.path_base,
      path.join(config.path_base, config.dir_src),
      // path.resolve(config.path_base, 'node_modules'),
      // path.resolve(config.path_base, 'static')
    ],
    extensions: ['', '.js', '.jsx']
  }
}
