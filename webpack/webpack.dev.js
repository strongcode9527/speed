const merge = require('webpack-merge'),
      common = require('./webpack.common'),
      webpack = require('webpack'),
      HtmlWebpackPlugin  = require('html-webpack-plugin')
      


common.entry.unshift('react-dev-utils/webpackHotDevClient')


module.exports =  merge(common, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({template: './index.html'}) 
  ]
})

