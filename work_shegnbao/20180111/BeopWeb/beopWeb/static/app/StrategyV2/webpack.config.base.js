const path = require('path');

exports.chunks = {
  ui: [
    'normalize.css',
    'office-ui-fabric-react/dist/css/fabric.min.css'
  ],
  app: path.join(__dirname, 'app/index.js')
};

exports.default = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: [
          /node_modules/,
          path.join(__dirname, 'app/themes/default/iconfont')
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[chunkhash].js',
    publicPath: './public'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css'],
    modules: [__dirname, 'node_modules']
  }
};
