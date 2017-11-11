import fs from 'fs-extra'
import path from 'path'
import hotStore from '@/store/modules/hots.js'
import unzipper from 'unzipper'
import etl from 'etl'
import {ipcRenderer as ipc} from 'electron'

export function unzipFile(zipSource) {
  unzipFileToDir(zipSource, path.dirname(zipSource))
}

async function unzipFileToDir(zipSource, unzipDestination) {
  fs.createReadStream(zipSource).pipe(unzipper.Parse()).pipe(etl.map(async entry => {
    let fileDestination = `${unzipDestination}/${entry.path}`
    // drain any temp sub-directories created during unzip
    if (isUnzippedTempDir(zipSource, fileDestination)) {
      entry.autodrain()
      return
    }
    switch (path.extname(entry.path)) {
      case '.csv':
        await ensureFile(fileDestination)
        await unzippedEntryToFile(entry, fileDestination)
        openFileIntoTab(fileDestination)
        break
      case '.json':
        await ensureFile(fileDestination)
        await unzippedEntryToFile(entry, fileDestination)
        break
      case '.md':
        await ensureFile(fileDestination)
        await unzippedEntryToFile(entry, fileDestination)
        await setProvenance(fileDestination)
        break
      default:
        entry.autodrain()
        break
    }
  }))
}

function isUnzippedTempDir(zipSource, fileDestination) {
  let sourceExtension = path.extname(zipSource)
  let sourceNoExt = zipSource.substring(0, zipSource.lastIndexOf(sourceExtension))
  return !_.startsWith(fileDestination, sourceNoExt)
}

async function unzippedEntryToFile(entry, fileDestination) {
  try {
    let returned = await entry.pipe(etl.toFile(fileDestination)).promise()
    return returned
  } catch (err) {
    console.log(`Error unzipping ${fileDestination}`)
    console.log(err)
  }
}

async function ensureFile(fileDestination) {
  try {
    await fs.ensureFile(fileDestination)
  } catch (err) {
    console.log(`Error touching file destination ${fileDestination}`)
    console.log(err)
  }
}

function openFileIntoTab(filename) {
  ipc.send('openFileIntoTab', filename)
}

async function setProvenance(filename) {
  try {
    let value = await etl.file(filename)
      .pipe(etl.stringify())
      .promise()
    // etl stringify always returns an array
    if (_.isEmpty(value)) {
      return
    }
    hotStore.mutations.pushProvenance(hotStore.state, JSON.parse(value).text)
  } catch (err) {
    console.log(`Error setting provenance from ${filename}`)
    console.log(err)
  }
}
