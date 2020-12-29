const path = require('path');
const baseConfig = require('./webpack.config.base');
const WebpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin'); //拷贝静态资源
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'); //压缩js
// const WebpackBundleAnalyze = require('webpack-bundle-analyzer'); // 打包文件分析

module.exports = WebpackMerge.merge(baseConfig, {
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
        },
      ],
    }),
    // new WebpackBundleAnalyze.BundleAnalyzerPlugin({
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8889,
    // }),
  ],
  optimization: {
    minimizer: [
      new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJs: {
          options: {
            comments: false,
            beautify: false,
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_wars: true,
          },
        },
      }),
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
