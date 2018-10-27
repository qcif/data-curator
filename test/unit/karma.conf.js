'use strict'

const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')

process.env.KARMA = true
const baseConfig = require('../../.electron-vue/webpack.renderer.config')
const projectRoot = path.resolve(__dirname, '../../src/renderer')

const staticDir = path.resolve(__dirname, '../../static')

// Set BABEL_ENV to use proper preset config
process.env.BABEL_ENV = 'test'

// can ignore warning for 'Tapable.plugin is deprecated' as problem lies with karma-webpack who are currently working through 4.xx rcs - wait until they're finished
// process.traceDeprecation = true

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

let webpackConfig = merge(baseConfig, {
  devtool: '#inline-source-map',
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
    browsers: ['Electron'],
    autoWatch: false,
    client: {
      useIframe: false
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    // customLaunchers: {
    //   'visibleElectron': {
    //     base: 'Electron'
    // flags: ['--show']
    //   }
    // },
    frameworks: ['mocha', 'sinon-chai'],
    proxies: {
      '/static': staticDir
    },
    files: [
      './index.js',
      { pattern: `${staticDir}/img/*.svg`, watched: false, included: false, served: true }
    ],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
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
