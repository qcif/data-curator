'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const {dependencies} = require('../package.json')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')
const FixDefaultImportPlugin = require('webpack-fix-default-import-plugin')

let yargsParsed = require('yargs-parser').detailed(process.argv.slice(2), {
  alias: {
    filename: ['f']
  },
  configuration: {
    'dot-notation': false
  }
})
let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js')
  },
  externals: [...Object.keys(dependencies || {})],
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
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  resolve: {
    extensions: [
      '.js', '.json', '.node'
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new FixDefaultImportPlugin(),
    new webpack.DefinePlugin({clFilename: JSON.stringify(yargsParsed.argv.filename)})
  ],
  target: 'electron-main'
}

/**
* Adjust mainConfig for development settings
*/
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(new webpack.DefinePlugin({
    '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
  }))
}

/**
* Adjust mainConfig for production settings
*/
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(new BabiliWebpackPlugin({removeConsole: true, removeDebugger: true}), new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}))
}

module.exports = mainConfig
