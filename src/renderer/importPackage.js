import fs from 'fs-extra'
import path from 'path'
import store from '@/store'
import unzipper from 'unzipper'
import etl from 'etl'
import {ipcRenderer as ipc} from 'electron'
import {Resource, Package} from 'datapackage'
import {dataResourceToFormat} from '@/file-formats.js'

// TODO: clean up isTransient logic
export async function unzipFile(zipSource, storeCallback, isTransient) {
  try {
    let destination = createUnzipDestination(zipSource)
    await fs.ensureDir(destination)
    let processedProperties = await unzipFileToDir(zipSource, destination, isTransient)
    storeCallback(processedProperties)
  } catch (err) {
    console.log(`Error processing zip source: ${zipSource}`, err)
    return err.message
  }
}

function createUnzipDestination(zipSource) {
  return path.join(path.dirname(zipSource), path.basename(zipSource, '.zip'))
}

async function unzipFileToDir(zipSource, unzipDestination, isTransient) {
  let processed = {json: [], resource: [], md: []}
  await fs.createReadStream(zipSource).pipe(unzipper.Parse()).pipe(etl.map(async entry => {
    let fileDestination = `${unzipDestination}/${entry.path}`
    await processStream(entry, processed, fileDestination)
  })).promise()
  validateMdFile(processed)
  // wait until all tabs opened before processing data package json
  if (processed.json.length !== 1) {
    throw new Error('There must be 1, and only 1, json file.')
  }
  let dataPackageJson = await getDataPackageJson(processed)
  let csvPathHotIds = await processResources(dataPackageJson, unzipDestination, processed, isTransient)
  let processedProperties = await processJson(dataPackageJson, csvPathHotIds, unzipDestination)
  return processedProperties
}

async function getDataPackageJson(processed) {
  let filename = processed.json[0]
  let text = await stringify(filename)
  let dataPackageJson = JSON.parse(text)
  return dataPackageJson
}

async function processStream(entry, processed, fileDestination) {
  for (const ignore of ['__MACOSX']) {
    if (fileDestination.includes(ignore)) {
      await cleanUp(entry, fileDestination)
    } else {
      switch (path.extname(entry.path)) {
        case '.csv':
        case '.tsv':
          await fs.ensureFile(fileDestination)
          await unzippedEntryToFile(entry, fileDestination)
          processed.resource.push(entry.path)
          break
        case '.json':
          await fs.ensureFile(fileDestination)
          await unzippedEntryToFile(entry, fileDestination)
          processed.json.push(fileDestination)
          processed.parentFolders = path.dirname(entry.path)
          break
        case '.md':
          await fs.ensureFile(fileDestination)
          await unzippedEntryToFile(entry, fileDestination)
          let textMd = await stringify(fileDestination)
          setProvenance(textMd)
          processed.md.push(fileDestination)
          break
        default:
          entry.autodrain()
          break
      }
    }
  }
}

async function cleanUp(entry, fileDestination) {
  entry.autodrain()
  try {
    await fs.remove(fileDestination)
  } catch (error) {
    console.error(`Ignoring file remove error. `, error)
  }
}

function validateMdFile(processed) {
  if (processed.md.length > 1) {
    throw new Error('Only 1 markdown file is allowed.')
  }
}

async function unzippedEntryToFile(entry, fileDestination) {
  let returned = await entry.pipe(etl.toFile(fileDestination)).promise()
  return returned
}

async function stringify(filename) {
  let value = await etl.file(filename)
    .pipe(etl.stringify())
    .promise()
  // etl always returns an array
  if (_.isEmpty(value)) {
    throw new Error(`Unable to find text in filename: ${filename}`)
  }
  let text = JSON.parse(value).text
  return text
}

function setProvenance(text) {
  store.commit('pushProvenance', text)
}

async function processResources(dataPackageJson, unzipDestination, processed, isTransient) {
  let resourcePaths = await getAllResourcePaths(dataPackageJson, unzipDestination, processed)
  let csvPathHotIds = await getHotIdsFromFilenames(processed, unzipDestination, isTransient)
  validateResourcesAndDataFiles(resourcePaths, _.keys(csvPathHotIds))
  return csvPathHotIds
}

async function getAllResourcePaths(dataPackageJson, unzipDestination, processed) {
  let resourcePaths = []
  for (let dataResource of dataPackageJson.resources) {
    let fileDestination
    if (processed.parentFolders) {
      fileDestination = path.join(unzipDestination, processed.parentFolders, dataResource.path)
    } else {
      fileDestination = path.join(unzipDestination, dataResource.path)
    }
    let format = dataResourceToFormat(dataResource)
    await ipc.send('openFileIntoTab', fileDestination, format)
    resourcePaths.push(dataResource.path)
  }
  return resourcePaths
}

function validateResourcesAndDataFiles(resourcePaths, csvPaths) {
  // every processed csv should match entry in resource of datapackage.json
  let diff = _.difference(resourcePaths, csvPaths)
  if (diff.length !== 0) {
    throw new Error('The resource paths and the csv files do not match.')
  }
}

async function getHotIdsFromFilenames(processed, unzipDestination, isTransient = false) {
  let dataPackageJson = processed.json[0]
  let csvTabs = {}
  for (let pathname of processed.resource) {
    let fileDestination = `${unzipDestination}/${pathname}`
    let tabId = await getTabIdFromFilename(fileDestination)
    // every processed csv should have a matching tab
    if (!tabId) {
      throw new Error(`There was a problem matching ${fileDestination} with an opened tab.`)
    }
    let hotId = _.findKey(store.getters.getHotTabs, {tabId: tabId})
    // ensure csv path accounts for parent folders zipped up
    let re = new RegExp('^' + processed.parentFolders + '/')
    let resourcePathname = _.replace(pathname, re, '')
    csvTabs[`${resourcePathname}`] = hotId
    if (isTransient) {
      store.commit('resetTabFilename', tabId)
    }
  }
  return csvTabs
}

async function getTabIdFromFilename(filename) {
  return new Promise((resolve, reject) => {
    let tabId = _.findKey(store.getters.getTabObjects, {filename: filename})
    if (!tabId) {
      // wait for tabs to be ready
      _.delay(function(filename) {
        resolve(_.findKey(store.getters.getTabObjects, {filename: filename}))
      }, 500, filename)
    } else {
      resolve(tabId)
    }
  })
}

function processJson(dataPackageJson, csvPathHotIds, unzipDestination) {
  let allTableProperties = dataPackageJson.resources
  let allColumnPropertiesByHotId = {}
  let allTablePropertiesByHotId = {}
  for (let tableProperties of allTableProperties) {
    allColumnPropertiesByHotId[csvPathHotIds[tableProperties.path]] = tableProperties.schema.fields
    _.unset(tableProperties, 'schema.fields')
    for (let property in tableProperties.schema) {
      tableProperties[property] = tableProperties.schema[property]
      _.unset(tableProperties, `schema.${property}`)
    }
    _.unset(tableProperties, 'schema')
    allTablePropertiesByHotId[csvPathHotIds[tableProperties.path]] = tableProperties
  }
  _.unset(dataPackageJson, 'resources')
  return {
    package: dataPackageJson,
    tables: allTablePropertiesByHotId,
    columns: allColumnPropertiesByHotId
  }
}
