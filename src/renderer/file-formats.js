
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
    dialect: {
      delimiter: ',',
      quoteChar: '"'
    },
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
    dialect: {
      delimiter: '\t',
      quoteChar: '"'
    },
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
    dialect: {
      delimiter: ';',
      quoteChar: '"'
    },
    mediatype: 'text/csv',
    format: 'csv'
  }
}

export {
  fileFormats
}
