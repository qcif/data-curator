import _ from 'lodash'
import fs from 'fs-extra'
import os from 'os'
import { applyFnToSelectorWithLabel } from './selectors'

export function getFilePathFromFixtures (fileName) {
  return require('path').join(__dirname, `../../../fixtures/${fileName}`)
}

export function getFileData (filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

export async function saveAndReturnData (app) {
  let tempFile = `${os.tmpdir()}/test.csv`
  await app.webContents.send('saveData', null, tempFile)
  await app.client.pause(4000)
  return fs.readFileSync(tempFile, 'utf-8')
}

export function arrayOfLinesToString (arrayOfLines) {
  return _.reduce(JSON.parse(arrayOfLines), function (result, next) {
    return result.concat(`${next}\n`)
  }, '')
}

export async function enterInputInFieldName (app, value, field, timeout) {
  const result = await applyFnToIdOrClassSelector(app, 'click', field, 'input', timeout)
  await app.client.keys(value)
  await app.client.pause(timeout)
  return result
}

export async function clickInputFieldName (app, field, timeout) {
  return applyFnToIdOrClassSelector(app, 'click', field, 'input', timeout)
}

export async function applyFnToIdOrClassSelector (app, fn, fieldIdOrClass, selector, timeout) {
  try {
    return applyFnToSelectorWithLabel(app, fn, `${selector}.${fieldIdOrClass}`, fieldIdOrClass, timeout)
  } catch (error) {
    console.log(`Unable to find via class. Trying id`)
    return applyFnToSelectorWithLabel(app, fn, `${selector}#${fieldIdOrClass}`, fieldIdOrClass, timeout)
  }
}
