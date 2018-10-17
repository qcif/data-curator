import fs from 'fs-extra'
import path from 'path'
import archiver from 'archiver'
import {remote} from 'electron'
import store from '@/store'
import {extractNameFromFile} from '@/store/tabStoreUtilities.js'
import {compileAndStringifyProvenance} from '@/provenance.js'
// import os from 'os'
const Dialog = remote.dialog

export function createZipFile(text) {
  let json = JSON.stringify(text, null, 4)
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
    generateDataPackage(filename, json)
  })
}

function generateDataPackage(filename, json) {
  let output = fs.createWriteStream(filename)
  let archive = archiver('zip', {
    zlib: {
      level: 9
    } // Sets the compression level.
  })
  output.on('close', () => {
    // console.log(archive.pointer() + ' total bytes')
  }).on('end', () => {
    // console.log('Data has been drained')
  })
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err
    }
  }).on('error', function(err) {
    throw err
  })
  archive.pipe(output)
  zipJson(archive, json)
  zipResources(archive)
  zipProvenanceProperties(archive)
  archive.finalize()
}

function zipJson(archive, json) {
  archive.append(json, { name: 'datapackage.json' })
}

function zipResources(archive) {
  for (let filename of store.getters.getTabFilenames) {
    let name = path.basename(filename)
    archive.append(fs.createReadStream(filename), { name: name, prefix: 'data' })
  }
}

function zipProvenanceProperties(archive) {
  archive.append(compileAndStringifyProvenance(), { name: 'README.md' })
}
