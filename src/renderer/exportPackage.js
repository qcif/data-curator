import fs from 'fs-extra'
import {
  remote
} from 'electron'
const Dialog = remote.dialog

export function createZipFile() {
  Dialog.showSaveDialog({
    filters: [
      {
        name: '*',
        extensions: ['zip']
      }
    ]
  }, function(filename) {
    if (filename === undefined) {
      return
    }
    generateDataPackage(filename)
  })
}

function generateDataPackage(filename) {
  console.log('ok')
}
