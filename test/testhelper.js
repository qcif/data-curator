// require('babel-core/register')({
//   // ignore: /node_modules/(?!ProjectB)/
//   ignore: /node_modules/
// })
if (process.env.NODE_ENV == 'test') {
  window._ = require('lodash')
}
require('babel-core').transform('code', {
  'plugins': ['lodash'],
  'presets': [['env', { 'targets': { 'node': 8 } }], 'es2015', 'stage-0']
})
import * as _ from 'lodash'
