// require('babel-core/register')({
//   // ignore: /node_modules/(?!ProjectB)/
//   ignore: /node_modules/
// })
require('babel-core').transform('code', {
  'plugins': ['lodash'],
  'presets': [['env', { 'targets': { 'node': 8 } }]]
})
import * as _ from 'lodash'
