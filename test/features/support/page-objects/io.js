import _ from 'lodash'
import fs from 'fs-extra'
// import { Subject } from 'rxjs/Subject'
// import { Observable } from 'rxjs/Observable'
// import { Subscription } from 'rxjs/Subscription'

let _activeHotId = null

export function getFilePathFromFixtures(fileName) {
  const filePath = require('path').join(__dirname, `../../../fixtures/${fileName}`)
  return filePath
}

export function getFileData(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8')
  return data
}

const defaultTabData = [['', '', '']]

export {
  defaultTabData
}
