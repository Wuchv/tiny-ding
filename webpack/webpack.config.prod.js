const path = require('path');
const baseConfig = require('./webpack.config.base');
const WebpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin'); //拷贝静态资源
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //压缩js

module.exports = WebpackMerge.merge(baseConfig, {
  mode: 'production',
  // devtool: 'cheap-module-eval-source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      // new UglifyJsPlugin({
      //   cache: true,
      //   parallel: true,
      //   sourceMap: true,
      // }),
      new OptimizeCssAssetsWebpackPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
        },
      },
    },
  },
  target: 'electron-renderer',
});
