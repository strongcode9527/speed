var path = require('path')
var webpack = require('webpack')


module.exports = {
  entry: "../examples/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'inline-source-map',
}