const Webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const WebpackMerge = require('webpack-merge');

const env =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';

const preloadConfig = WebpackMerge.merge(baseConfig, {
  mode: env,
  target: 'electron-preload',
  entry: {
    preload: './app/preload/index.ts',
  },
  devtool: env === 'development' ? 'source-map' : false,
  plugins: [
    new Webpack.EnvironmentPlugin({
      NODE_ENV: env,
    }),
  ],
});

module.exports = preloadConfig;
