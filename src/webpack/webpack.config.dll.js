// 抽离不变的第三方模块
const path = require('path');
const Webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'antd',
      '@ant-design/icons',
      'lodash',
      'axios',
      'redux',
      'rxjs',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../../dist/static/js'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins: [
    new Webpack.DllPlugin({
      path: path.resolve(__dirname, '../../dist/static/[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname,
    }),
  ],
};
