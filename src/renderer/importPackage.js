import fs from 'fs-extra'
import path from 'path'
import hotStore from '@/store/modules/hots.js'
import unzipper from 'unzipper'
import etl from 'etl'
import {ipcRenderer as ipc} from 'electron'

export function unzipFile(zipSource, storeCallback) {
  console.log('trying to unzip...')
  unzipFileToDir(zipSource, path.dirname(zipSource), storeCallback)
}

function unzipFileToDir(zipSource, unzipDestination, storeCallback) {
  console.log(`zip source is ${zipSource}`)
  console.log(`unzip destination is ${unzipDestination}`)
  fs.createReadStream(zipSource).pipe(unzipper.Parse()).pipe(etl.map(async entry => {
    try {
      console.log(`entry path is ${entry.path}`)
      let fileDestination = `${unzipDestination}/${entry.path}`
      console.log(`file destination: ${fileDestination}`)
      switch (path.extname(entry.path)) {
        case '.csv':
          console.log('getting csv')
          await fs.ensureFile(fileDestination)
          await unzippedEntryToFile(entry, fileDestination)
          ipc.send('openFileIntoTab', fileDestination)
          break
        case '.json':
          console.log('getting json')
          await fs.ensureFile(fileDestination)
          await unzippedEntryToFile(entry, fileDestination)
          let textJson = await stringify(fileDestination)
          processJson(textJson, storeCallback)
          break
        case '.md':
          console.log('getting md')
          await fs.ensureFile(fileDestination)
          await unzippedEntryToFile(entry, fileDestination)
          let textMd = await stringify(fileDestination)
          await setProvenance(textMd)
          break
        default:
          entry.autodrain()
          break
      }
    } catch (err) {
      console.log(`Error processing unzipped entry: ${entry.path}`)
      console.log(err)
    }
  }))
}

// function isUnzippedTempDir(zipSource, fileDestination) {
//   let sourceExtension = path.extname(zipSource)
//   let sourceNoExt = zipSource.substring(0, zipSource.lastIndexOf(sourceExtension))
//   return !_.startsWith(fileDestination, sourceNoExt)
// }

async function unzippedEntryToFile(entry, fileDestination) {
  let returned = await entry.pipe(etl.toFile(fileDestination)).promise()
  return returned
}

async function stringify(filename) {
  let value = await etl.file(filename)
    .pipe(etl.stringify())
    .promise()
  // console.log('value is...')
  // console.log(value)
  // console.log(JSON.parse(value))
  return value
}

async function setProvenance(value) {
  // etl always returns an array
  if (_.isEmpty(value)) {
    return
  }
  hotStore.mutations.pushProvenance(hotStore.state, JSON.parse(value).text)
}

function processJson(value, storeCallback) {
  if (_.isEmpty(value)) {
    return
  }
  let text = JSON.parse(value).text
  let datapackageProperties = JSON.parse(text)
  let allTableProperties = datapackageProperties.resources
  let allColumnProperties = []
  allTableProperties.map(function(tableProperties) {
    allColumnProperties.push(tableProperties.schema.fields)
  })
  allTableProperties.map(function(tableProperties) {
    _.unset(tableProperties, 'schema.fields')
    for (let property in tableProperties.schema) {
      tableProperties[property] = tableProperties.schema[property]
      _.unset(tableProperties, `schema.${property}`)
    }
    _.unset(tableProperties, 'schema')
  })
  _.unset(datapackageProperties, 'resources')
  console.log('package properties')
  console.log(datapackageProperties)
  // hotStore.mutations.resetPackagePropertiesToObject(hotStore.state, datapackageProperties)
  storeCallback('package', datapackageProperties)
  console.log('table properties')
  console.log(allTableProperties)
  // hotStore.mutations.resetTablePropertiesToObject(hotStore.state, allTableProperties)
  console.log('column properties')
  console.log(allColumnProperties)
}
//
// function setPackageProperties(datapackageProperties) {
//   for (let property in datapackageProperties) {
//     hotStore.mutations.pushPackageProperty(hotStore.state, {key: property, value: datapackageProperties[property]})
//   }
// }

// function setTableProperties(datapackageProperties) {
//   for (let table of tableProperties) {
//
//   }
// }
