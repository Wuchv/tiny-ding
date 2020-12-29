const path = require('path');
const Webpack = require('webpack');
const HappyPack = require('happypack'); //开启多进程Loader转换
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html自动引入js
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //打包前清除输出文件夹
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 在打包后的html中拆分css以外链的形式引入

const entryBundleDir = path.join(__dirname, '../src/index.tsx');
const outDir = path.join(__dirname, '../dist');

const baseConfig = {
  entry: {
    bundle: ['@babel/polyfill', entryBundleDir],
  },
  output: {
    path: outDir,
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js',
    publicPath: './',
  },

  devtool: 'source-map',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        // enforce: 'pre',
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', { modules: false }],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#806d9e',
                  'link-color': '#806d9e',
                  'border-radius-base': '2px',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]',
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]',
                },
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HappyPack({
      id: 'happyBabel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
          cacheDirectory: true,
        },
      ],
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        //自定义要删除的文件
        'css/*',
        'js/*',
        'index.html',
        '!static/*',
        '!main',
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].[hash:8].css',
    }),
    new Webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../dist/static/vendor-manifest.json'),
    }),
  ],
};

module.exports = baseConfig;
