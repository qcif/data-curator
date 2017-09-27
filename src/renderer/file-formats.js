
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
    options: {
      separator: ',',
      delimiter: '"'
    },
    mime_type: 'text/csv',
    default_extension: 'csv'
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
    options: {
      separator: '\t',
      delimiter: '"'
    },
    mime_type: 'text/tab-separated-values',
    default_extension: 'tsv'
  },
  semicolon: {
    label: 'Semicolon separated...',
    filters: [
      {
        name: 'csv files',
        extensions: ['csv']
      }
    ],
    options: {
      separator: ';',
      delimiter: '"'
    },
    mime_type: 'text/csv',
    default_extension: 'csv'
  }
}

export {
  fileFormats
}
