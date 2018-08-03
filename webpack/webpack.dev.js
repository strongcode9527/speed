const merge = require('webpack-merge'),
      common = require('./webpack.common'),
      webpack = require('webpack')
        = require('extract-text-webpack-plugin')
      
module.exports =  merge({
  devServer: {
    port: 9527,
    open: true,
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({template: '../index.html'})
  ]
})

