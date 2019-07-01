import { expect } from 'chai'
import { When, Then } from 'cucumber'
import parse from 'csv-parse/lib/sync'
import { tableRowAndColCount } from '../page-objects/dimensions.js'
import { getFileData, getFilePathFromFixtures } from '../page-objects/io.js'
import { fileFormats } from '../../../../src/renderer/file-formats'

Then(/^the table rows and columns should match the "([\w]+)" file$/, async function (csvType) {
  const data = getFileData(this.latestFilePath)
  let arrays
  switch (csvType) {
    case 'csv':
      // node-csv default is csv
      arrays = parse(data)
      break
    default:
      throw new Error(`csv type: ${csvType} is not supported.`)
  }
  const numberOfRows = arrays.length
  const nonHeaderRows = numberOfRows - 1
  const numberOfCols = arrays[0].length
  const { tableRowCount, tableColCount } = await tableRowAndColCount(this.app)
  expect(tableRowCount).to.equal(nonHeaderRows)
  expect(tableColCount).to.equal(numberOfCols)
})

When(/the "(csv|tsv)" file "(.+?)" is selected in the openfile dialog/, async function (fileType, filename) {
  this.latestFilePath = getFilePathFromFixtures(filename)
  await this.app.electron.ipcRenderer.send('openFileIntoTab', this.latestFilePath, fileFormats.csv)
})

Then(/a new tab with the title "(.+?)" should be displayed/, async function (tabname) {
  let text = await this.app.client
    .timeouts('implicit', 5000)
    .getText('#tab1')
  expect(text).to.equal(tabname)
})
