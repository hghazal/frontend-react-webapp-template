import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = function(config) {
  config.set({
    
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    
    // CircleCI sets the CI environment variable to true
    // https://circleci.com/docs/environment-variables
    singleRun: !!process.env.CI,

    frameworks: [ 'mocha' ],
    
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      '*.spec.js',
      '**/*.spec.js',
    ],

    preprocessors: {
      '*.spec.js': [ 'webpack', 'sourcemap' ],
      '**/*.spec.js': [ 'webpack', 'sourcemap' ],
    },

    reporters: ['mocha'],

    plugins: [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-sourcemap-loader'),
    ],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: { limit: 10240 } },
          { test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['babel'] },
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
        ],
      },
      resolve: {
        modulesDirectories: [
          '.',
          'src',
          'node_modules',
        ],
        extensions: ['', '.json', '.js', 'jsx'],
      },
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('css/[name].css', {allChunks: true}),
        new webpack.DefinePlugin({
          __DEV__: true,
          __DEVTOOLS__: false,
        }),
      ],
    },

    webpackServer: {
      noInfo: true,
    },
    
    reportSlowerThan: 100,
    
    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

  });
};
