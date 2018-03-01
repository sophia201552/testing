const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');

const webpackConfig = require('./webpack.config.base');
const baseConfig = webpackConfig.default;
const chunks = webpackConfig.chunks;

const pkg = require('./package.json');

const OUTPUT_PATH = path.join(__dirname, '../../webpack-gen/');
const PUBLIC_PATH = '/static/webpack-gen/';

exports.default = merge(baseConfig, {
  entry: Object.assign({}, chunks),

  output: {
    filename: '[name].bundle.js',
    path: OUTPUT_PATH,
    publicPath: PUBLIC_PATH
  },

  module: {
    rules: [
      // Extract all .global.css to style.css as is
      {
        test: /\.global\.css$/,
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
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CleanWebpackPlugin([OUTPUT_PATH + '/*.*'], {
      allowExternal: true
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: false
    }),

    new HtmlWebpackPlugin({
      hash: true,
      filename: path.resolve(OUTPUT_PATH, 'app.html'),
      template: path.resolve(__dirname, 'index.ejs'),
      title: 'Algorithm Developer',
      inject: false,
      chunks: ['manifest', 'common', 'react', 'jquery', 'chart', 'svg', 'i18n', 'app', 'ui'],
      chunksSortMode: 'manual'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.[hash].js',
      minChunks: ({ context, resource }) => {
        if (resource && /^.*\.css$/.test(resource)) {
          return false;
        }
        return /node_modules/.test(context);
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'i18n',
      chunks: ['app'],
      filename: 'i18n.[hash].js',
      minChunks: ({ context, resource }) => {
        return /(?:zh|en)\.js$/.test(resource);
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'react',
      chunks: ['common'],
      filename: 'react.[hash].js',
      minChunks: ({ context, resource }) => {
        let path = context.slice(context.indexOf('node_modules') + 13);
        return [
          'react',
          'react-dom',
          'prop-types',
          'redux',
          'react-redux',
          'reselect',
          'history',
          'react-router',
          'react-router-dom',
          'react-router-redux',
          'redux-observable'
        ].some(row => path.startsWith(row));
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'chart',
      chunks: ['common'],
      filename: 'chart.[hash].js',
      minChunks: ({ context, resource }) => {
        let path = context.slice(context.indexOf('node_modules') + 13);
        return ['echarts', 'zrender', 'echarts-for-react'].some(row =>
          path.startsWith(row)
        );
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'svg',
      chunks: ['common'],
      filename: 'svg.[hash].js',
      minChunks: ({ context, resource }) => {
        let path = context.slice(context.indexOf('node_modules') + 13);
        return ['svg.js', 'svg.draggy.js', 'svg.intersections.js'].some(row =>
          path.startsWith(row)
        );
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'jquery',
      chunks: ['common'],
      filename: 'jquery.[hash].js',
      minChunks: ({ context, resource }) => {
        let path = context.slice(context.indexOf('node_modules') + 13);
        return ['jquery'].some(row => path.startsWith(row));
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename: 'manifest.[hash].js',
      minChunks: Infinity
    }),

    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 6,
        warnings: true
      }
    })
  ]
});
