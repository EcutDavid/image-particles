var path = require('path');

var srcPath = path.join(__dirname, '/../src');

module.exports = {
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: process.env.REACT_WEBPACK_ENV === 'dist' ? 'app[hash].js' : 'app.js',
    publicPath: './assets/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      actions: srcPath + '/actions/',
      components: srcPath + '/components/',
      sources: srcPath + '/sources/',
      stores: srcPath + '/stores/',
      styles: srcPath + '/styles/'
    }
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }, {
        test: /\.scss/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader'
          }, {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded'
            }
          }
        ]
      }, {
        test: /\.(png|jpg|gif|woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }, {
        test: /\.(mp4|ogg|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'file-loader'
        ]
      }, {
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader'
        ],
        include: path.join(__dirname, '/../src')
      }, {
        test: /\.(ts|tsx)$/,
        use: [
          'ts-loader'
        ],
        include: path.join(__dirname, '/../src')
      }
    ]
  }
};
