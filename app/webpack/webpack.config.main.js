const path = require('path');
const Webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const WebpackMerge = require('webpack-merge');

const env =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';
const entryMainDir = path.join(__dirname, '../main.tsx');

const devConfig = WebpackMerge.merge(baseConfig, {
  mode: env,
  target: 'electron-main',
  entry: {
    main: ['@babel/polyfill', entryMainDir],
  },
  plugins: [
    new Webpack.EnvironmentPlugin({
      NODE_ENV: env,
    }),
  ],
});

module.exports = devConfig;
