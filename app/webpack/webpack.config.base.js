const path = require('path');

const config = {
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '../../dist/main'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.jsx'],
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
  node: {
    __dirname: false,
    __filename: false,
  },
};

module.exports = config;
