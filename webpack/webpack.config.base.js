const os = require('os');
const path = require('path');
const HappyPack = require('happypack'); //开启多进程Loader转换
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html自动引入js
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //打包前清除输出文件夹
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 在打包后的html中拆分css以外链的形式引入

const isDev = process.env.NODE_ENV == 'development';
const happyThreadTool = HappyPack.ThreadPool({ size: os.cpus().length });
const entryBundleDir = path.join(__dirname, '../src/index.tsx');
const entryMainDir = path.join(__dirname, '../main.tsx');
const outDir = path.join(__dirname, '../dist');

const baseConfig = {
  entry: {
    bundle: ['@babel/polyfill', entryBundleDir],
    // main: ['@babel/polyfill', entryMainDir],
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
            presets: ['@babel/preset-env'],
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
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
          },
          'less-loader',
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? 'css/[name].css' : 'css/[name].[hash].css',
      chunkFilename: isDev ? 'css/[id].css' : 'css/[id].[hash].css',
    }),
  ],
};

module.exports = baseConfig;
