const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
      


common.entry.unshift('react-dev-utils/webpackHotDevClient')


module.exports =  merge(common, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({template: './index.html'}) 
  ]
})

