const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const pkg = require('./package.json');

const OUTPUT_PATH = path.join(__dirname, './dist');
const PUBLIC_PATH = '/dist/';

exports.default = {
  entry: {
    "StrategyV2-Engine": "./index.js",
    "StrategyV2-Engine.min": "./index.js",
  },

  output: {
    filename: '[name].js',
    path: OUTPUT_PATH,
    publicPath: PUBLIC_PATH,
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: [
          /node_modules/
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [__dirname, 'node_modules']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CleanWebpackPlugin([OUTPUT_PATH + '/*.*'], {
      allowExternal: false
    })
  ]
};
