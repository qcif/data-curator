'use strict'

process.env.BABEL_ENV = 'renderer'
const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

// despite `DeprecationWarning: Tapable.plugin is deprecated.` Do not upgrade: causes issues with handsontable creating blanks/repeats in rows
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let whiteListedModules = ['vue']
const defaultMinify = {
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  removeComments: true
}

const defaultNodeModules = process.env.NODE_ENV !== 'production'
  ? path.resolve(__dirname, '../node_modules')
  : false

let rendererConfig = {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    renderer: path.join(__dirname, '../src/renderer/main.js')
  },
  externals: [
    ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
  ],
  optimization: !process.env.KARMA ? {
    minimize: false,
    runtimeChunk: {
      name: 'vendor'
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          minSize: 1
        }
      }
    }
  } : {},
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-formatter-friendly')
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader',
        enforce: 'post'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: process.env.NODE_ENV === 'production',
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader',
              styl: 'vue-style-loader!css-loader!stylus-loader'
              // styl: 'MiniCssExtractPlugin.loader!css-loader!stylus-loader'
            }
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new VueLoaderPlugin(),
    createHtmlPlugin('index'),
    createHtmlPlugin('keyboardhelp'),
    createHtmlPlugin('urldialog'),
    createHtmlPlugin('openexcel'),
    createHtmlPlugin('errors'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.esm.js',
      'static': path.resolve(__dirname, '../static')
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node', '.styl']
  },
  target: 'electron-renderer'
}

function createHtmlPlugin (pageName) {
  return new HtmlWebpackPlugin({
    filename: `${pageName}.html`,
    template: path.resolve(__dirname, `../src/${pageName}.ejs`),
    minify: defaultMinify,
    nodeModules: defaultNodeModules
  })
}

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== 'production' || process.env.KARMA) {
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production' && !process.env.KARMA) {
  rendererConfig.devtool = false

  rendererConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, '../dist/electron/static'),
          globOptions: {
            ignore: ['.*']
          }
        }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  )
}

module.exports = rendererConfig
