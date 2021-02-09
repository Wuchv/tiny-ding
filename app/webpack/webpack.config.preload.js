const Webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const WebpackMerge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //打包前清除输出文件夹

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
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        //自定义要删除的文件
        '!main.js',
        'preload.js',
      ],
    }),
    new Webpack.EnvironmentPlugin({
      NODE_ENV: env,
    }),
    new Webpack.ExternalsPlugin('commonjs', ['leveldown']),
  ],
});

module.exports = preloadConfig;
