import fs from 'fs-extra'
import archiver from 'archiver'
import {remote} from 'electron'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import {extractNameFromFile} from '@/store/tabStoreUtilities.js'
const Dialog = remote.dialog

export function createZipFile(json) {
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
    console.log('json is:')

    // add package properties back in to json
    let updatedJson = addAdditionalProperties(json)
    generateDataPackage(filename, updatedJson)
  })
}

function addAdditionalProperties(json) {
  let object = JSON.parse(json)
  addPackageProperties(object)
  return JSON.stringify(object)
}

function addPackageProperties(object) {
  let packageProperties = hotStore.state.packageProperties
  _.merge(object, packageProperties)
}

function generateDataPackage(filename, json) {
  let output = fs.createWriteStream(filename)
  let archive = archiver('zip', {
    zlib: {
      level: 9
    } // Sets the compression level.
  })
  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
  }).on('end', () => {
    console.log('Data has been drained')
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
  console.log('ok')
}

function zipJson(archive, json) {
  archive.append(json, { name: 'datapackage.json' })
}

function zipResources(archive) {
  for (let filename of tabStore.getters.getTabFilenames(tabStore.state)) {
    let name = extractNameFromFile(filename)
    archive.append(fs.createReadStream(filename), { name: name, prefix: 'data' })
  }
}

function zipProvenanceProperties(archive) {
  let provenance = hotStore.state.provenanceProperties.markdown
  archive.append(provenance, { name: 'Readme.md' })
}
