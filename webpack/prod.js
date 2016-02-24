import Express from 'express';
import webpack from 'webpack';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import webpackBaseConfig from './webpack-base-config';
import config from '../config';

Object.assign(global, config.globals);


var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
const webpackConfig = webpackBaseConfig;

export default webpackConfig
