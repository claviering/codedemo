// webpack --config webpack.config.js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './webpack/index.js',
  output: {
    filename: 'output.js',
    path: path.resolve(__dirname, ''),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};