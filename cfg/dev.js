var webpack = require('webpack');
var baseConfig = require('./base');

var config = Object.assign({}, baseConfig, {
  entry: [
    // https://webpack.js.org/guides/hmr-react/
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://127.0.0.1:' + process.env.PORT,
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  devServer: {
    contentBase: './src/',
    hot: true,
    publicPath: '/assets/',
    port: process.env.PORT
  },
  cache: true,
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});

module.exports = config;
