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
