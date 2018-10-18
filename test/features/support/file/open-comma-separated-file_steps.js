import { expect } from 'chai'
import { Then } from 'cucumber'
import parse from 'csv-parse/lib/sync'
import { tableRowAndColCount } from '../page-objects/dimensions.js'
import { getFileData } from '../page-objects/io.js'

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
  const numberOfCols = arrays[0].length
  const { tableRowCount, tableColCount } = await tableRowAndColCount(this.app)
  expect(tableRowCount).to.equal(numberOfRows)
  expect(tableColCount).to.equal(numberOfCols)
})
