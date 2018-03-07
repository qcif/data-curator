import _ from 'lodash'
import {DEFAULT_DIALECT as _dialectDefaults} from 'datapackage/lib/config.js'
/**
 * Definitions for supported file types
 *
 * Add more objects here to support additional formats
 */

const fileFormats = {
  csv: {
    label: 'Comma separated...',
    filters: [
      {
        name: 'csv files',
        extensions: ['csv']
      }
    ],
    dialect: _.assign({
      delimiter: ','
    }, _dialectDefaults),
    mediatype: 'text/csv',
    format: 'csv'
  },
  tsv: {
    label: 'Tab separated...',
    filters: [
      {
        name: 'tsv files',
        extensions: ['tsv']
      }, {
        name: 'txt files',
        extensions: ['txt']
      }, {
        name: 'dat files',
        extensions: ['dat']
      }
    ],
    dialect: _.assign({
      delimiter: '\t'
    }, _dialectDefaults),
    mediatype: 'text/tab-separated-values',
    format: 'tsv'
  },
  semicolon: {
    label: 'Semicolon separated...',
    filters: [
      {
        name: 'csv files',
        extensions: ['csv']
      }
    ],
    dialect: _.assign({
      delimiter: ';'
    }, _dialectDefaults),
    mediatype: 'text/csv',
    format: 'csv'
  }
}

export {
  fileFormats
}
