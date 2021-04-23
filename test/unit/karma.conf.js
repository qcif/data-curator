'use strict'

const path = require('path')
const {merge} = require('webpack-merge')
const webpack = require('webpack')

process.env.KARMA = true
const baseConfig = require('../../.electron-vue/webpack.renderer.config')

const staticDir = path.resolve(__dirname, '../../static')

// Set BABEL_ENV to use proper preset config
process.env.BABEL_ENV = 'unit'

// can ignore warning for 'Tapable.plugin is deprecated' as problem lies with karma-webpack who are currently working through 4.xx rcs - wait until they're finished
process.traceProcessWarnings = true

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false

let webpackConfig = merge(baseConfig, {
  devtool: 'inline-source-map',
  optimization: {},
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"testing"'
    })
  ],
  mode: 'none'
})

// don't treat dependencies as externals
delete webpackConfig.entry
delete webpackConfig.externals
delete webpackConfig.output.libraryTarget

// apply vue option to apply isparta-loader on js
webpackConfig.module.rules
  .find(rule => rule.use.loader === 'vue-loader').use.options.loaders.js = 'babel-loader'

module.exports = config => {
  config.set({
    browsers: ['visibleElectron'],
    autoWatch: false,
    client: {
      useIframe: false,
      mocha: {
        timeout: 10000
      }
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        {type: 'lcov', subdir: '.'},
        {type: 'text-summary'}
      ]
    },
    frameworks: ['mocha', 'sinon-chai', 'webpack'],
    customLaunchers: {
      visibleElectron: {
        base: 'Electron',
        browserWindowOptions: {
          show: true,
          webPreferences: {
            preload: './index.js',
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            nativeWindowOpen: true
          }
        }
      },
    },
    proxies: {
      '/static': staticDir
    },
    files: [
      './index.js',
      {pattern: `${staticDir}/img/*.svg`, watched: false, included: false, served: true}
    ],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap', 'electron']
    },
    logLevel: config.LOG_INFO,
    reporters: ['spec', 'coverage', 'coveralls'],
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
