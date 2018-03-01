const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const webpackConfig = require('./webpack.config.base');
const baseConfig = webpackConfig.default;
const chunks = webpackConfig.chunks;

const pkg = require('./package.json');
const proxyConfig = require('./proxy.json');

const host = '0.0.0.0';
const port = process.env.PORT || 3000;
const publicPath = `/public`;

const devEntry = [
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://${host}:${port}/`,
  'webpack/hot/only-dev-server'
];

//合并
exports.default = merge(baseConfig, {
  devtool: 'eval-source-map',
  entry: Object.assign(
    {
      dev: devEntry
    },
    chunks
  ),

  output: {
    filename: '[name].bundle.js',
    publicPath: publicPath
  },

  module: {
    rules: [
      // *.global.css 作为全局样式加载
      {
        test: /(\.global)\.css$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
          fallback: 'style-loader'
        })
      },
      {
        test: /^((?!\.global).)*\.css$/,
        include: [path.resolve(__dirname, 'node_modules')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /^((?!\.global).)*\.css$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          }
        })
      },
      // 普通 json 文件加载器
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader'
      },
      {
        test: /\.worker\.js$/,
        use: 'worker-loader'
      }
    ]
  },

  plugins: [
    // https://webpack.js.org/concepts/hot-module-replacement/
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: false
    }),

    new HtmlWebpackPlugin({
      hash: true,
      title: 'Algorithm Developer',
      filename: 'app-dev.html',
      template: 'index.ejs',
      alwaysWriteToDisk: true,
      inject: false,
      chunks: ['manifest', 'common', 'dev', 'app', 'ui'],
      chunksSortMode: 'manual'
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: __dirname
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.[hash].js'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename: 'manifest.[hash].js',
      minChunks: Infinity
    })
  ],
  devServer: {
    port,
    host,
    hot: true,
    inline: true,
    proxy: proxyConfig,
    disableHostCheck: true,
    historyApiFallback: {
      verbose: true,
      index: '/app-dev.html'
    },
    publicPath
  }
});
