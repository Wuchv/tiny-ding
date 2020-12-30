const path = require('path');
const Webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //打包前清除输出文件夹

const entryMainDir = path.join(__dirname, '../app/main.tsx');

const config = {
  mode: 'development',
  devtool: 'source-map',
  target: 'electron-main',
  entry: {
    main: ['@babel/polyfill', entryMainDir],
  },
  output: {
    path: path.join(__dirname, '../dist/main'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
};

module.exports = config;
