import _ from 'lodash'
import fs from 'fs-extra'
import os from 'os'
import { applyFnToDualSelectors, applyFnToSelectorWithLabel } from './selectors'

export function getFilePathFromFixtures (fileName) {
  const filePath = require('path').join(__dirname, `../../../fixtures/${fileName}`)
  return filePath
}

export function getFileData (filePath) {
  const data = fs.readFileSync(filePath, 'utf-8')
  return data
}

const defaultTabData = [['', '', '']]

export function isDataEqualToDefaultData (data) {
  // NB: arrays might contain mix of quotes
  const sanitisedDefault = _.compact(_.flatten(defaultTabData))
  const sanitisedData = _.compact(_.flatten(JSON.parse(data)))
  // TODO: brittle as check only works while default is no data
  return sanitisedDefault.length === 0 && sanitisedDefault.length === sanitisedData.length
}

export async function saveAndReturnData (app) {
  let tempFile = `${os.tmpdir()}/test.csv`
  await app.webContents.send('saveData', null, tempFile)
  await app.client.pause(4000)
  let returnedData = fs.readFileSync(tempFile, 'utf-8')
  return returnedData
}

export function arrayOfLinesToString (arrayOfLines) {
  return _.reduce(JSON.parse(arrayOfLines), function (result, next) {
    return result.concat(`${next}\n`)
  }, '')
}

export async function enterInputInFieldName (app, value, field, timeout) {
  const result = await applyFnToIdOrClassSelectorWithParent(app, 'click', field, 'input', timeout)
  await app.client.keys(value)
  await app.client.pause(timeout)
  return result
}

export async function applyFnToIdOrClassSelectorWithParent (app, fn, field, parent, timeout) {
  try {
    const result = await applyFnToSelectorWithLabel(app, fn, `${parent}.${field}`, field, timeout)
    return result
  } catch (error) {
    console.log(`Unable to find via class. Trying id`)
    const result = await applyFnToSelectorWithLabel(app, fn, `${parent}#${field}`, field, timeout)
    return result
  }
}

export {
  defaultTabData
}
