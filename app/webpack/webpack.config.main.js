const path = require('path');
const Webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const WebpackMerge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //打包前清除输出文件夹

const env =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';
const entryMainDir = path.join(__dirname, '../main.ts');

const devConfig = WebpackMerge.merge(baseConfig, {
  mode: env,
  watch: true,
  target: 'electron-main',
  entry: {
    main: ['@babel/polyfill', entryMainDir],
  },
  plugins: [
    new Webpack.ExternalsPlugin('commonjs', ['leveldown']),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        //自定义要删除的文件
        'main.js',
        '!preload.js',
      ],
    }),
    new Webpack.EnvironmentPlugin({
      NODE_ENV: env,
    }),
  ],
});

module.exports = devConfig;
