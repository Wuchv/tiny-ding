const path = require('path');
const Webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const WebpackMerge = require('webpack-merge');

const devConfig = WebpackMerge.merge(baseConfig, {
  mode: 'development',
  devServer: {
    publicPath: '/',
    port: 3000,
    hot: true,
    contentBase: path.resolve(__dirname, '../dist'),
    historyApiFallback: true,
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()],
});

module.exports = devConfig;
