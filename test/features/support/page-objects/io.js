import _ from 'lodash'
import fs from 'fs-extra'

export function getFilePathFromFixtures(fileName) {
  const filePath = require('path').join(__dirname, `../../../fixtures/${fileName}`)
  return filePath
}

export function getFileData(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8')
  return data
}

const defaultTabData = [['', '', '']]

export function isDataEqualToDefaultData(data) {
  // NB: arrays might contain mix of quotes
  const sanitisedDefault = _.compact(_.flatten(defaultTabData))
  const sanitisedData = _.compact(_.flatten(JSON.parse(data)))
  // TODO: brittle as check only works while default is no data
  return sanitisedDefault.length === 0 && sanitisedDefault.length === sanitisedData.length
}

export {
  defaultTabData
}
