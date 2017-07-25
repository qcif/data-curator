'use strict'

process.env.BABEL_ENV = 'main'
process.env.NODE_ENV = 'test'

const nodeExternals = require('webpack-node-externals')

const path = require('path')
const {dependencies} = require('../package.json')
const webpack = require('webpack')
const WebpackShellPlugin = require('webpack-shell-plugin')

const BabiliWebpackPlugin = require('babili-webpack-plugin')
const FixDefaultImportPlugin = require('webpack-fix-default-import-plugin')

let mainTestConfig = {
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      }, {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: true,
    __filename: true
  },
  resolve: {
    extensions: [
      '.js', '.json', '.node'
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new FixDefaultImportPlugin(),
  ],
  target: 'electron'
}

/**
* Adjust mainTestConfig for development settings
*/

  mainTestConfig.plugins.push(new webpack.DefinePlugin({
    '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
  }))

 module.exports = mainTestConfig
