import fs from 'fs-extra'
import path from 'path'
import archiver from 'archiver'
import {remote} from 'electron'
import store from '@/store/modules'
// import tabStore from '@/store/modules/tabs.js'
// import hotStore from '@/store/modules/hots.js'
import {extractNameFromFile} from '@/store/tabStoreUtilities.js'
import os from 'os'
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
  for (let filename of store.getters.getTabFilenames()) {
  // for (let filename of tabStore.getters.getTabFilenames(tabStore.state)) {
    let name = path.basename(filename)
    archive.append(fs.createReadStream(filename), { name: name, prefix: 'data' })
  }
}

function zipProvenanceProperties(archive) {
  // console.log('current provenance')
  // console.log(hotStore.state.provenanceProperties)
  let provenance = store.state.provenanceProperties.markdown
  let allErrors = []
  _.forEach(store.state.provenanceProperties.hotErrors, function(errors, hotId) {
  // _.forEach(hotStore.state.provenanceProperties.hotErrors, function(errors, hotId) {
    const tabTitle = getTabTitleFromHotId(hotId)
    let errorsArray = _.map(errors, function(error) {
      console.log(`next error`, error)
      return `${error.name}: ${error.message}`
    })
    errorsArray.unshift(tabTitle)
    allErrors.push(errorsArray.join(os.EOL))
  })
  let errorsPre = getErrorsPreText()
  let pText = `${provenance}${os.EOL}${errorsPre}${allErrors.join(os.EOL)}`
  archive.append(pText, { name: 'README.md' })
}

function getTabTitleFromHotId(hotId) {
  // const tabId = hotStore.getters.getTabIdFromHotId(hotStore.state, hotStore.getters)(hotId)
  const tabId = store.getters.getTabIdFromHotId(hotId)
  // return tabStore.getters.tabTitle(state, getters)(tabId)
  return store.getters.tabTitle(tabId)
}

// TODO: refactor this and other common functions in home,errors,provenance
function getErrorsPreText() {
  return `### Known Data Errors

This data is published with the following data errors:

`
}
