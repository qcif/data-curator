import { expect, should, assert } from 'chai'
import { Given, When, Then} from 'cucumber'
import chai from 'chai'
const _ = require('lodash')
chai.should()
// chai.use(chaiAsPromised)

Given(/^I click in row (\d+), column (\d+)$/, function (rowNumber, colNumber) {
  this.rowNumber = rowNumber
  this.colNumber = colNumber
  return this.app.webContents.send('selectHotCell', rowNumber, colNumber)
})

When(/^I right-click$/, function () {
  let app = this.app
  return this.app.client
    .rightClick('.ht_master table')
})

Then(/^I click on "Insert Row Below"$/, function () {
  return this.app
    .webContents.send('clickLabelOnContextMenu', 'Insert row below')
})

Then(/^I should see (\d+) new row[s]? below the current row$/, function (numberOfNewRows) {
  let worldRowNumber = this.rowNumber
  return this.app.client
    .element('.editor.handsontable')
    .elements('.ht_master table tr th')
    .then(function(response) {
      expect(response.value.length).to.equal(worldRowNumber + numberOfNewRows)
    })
})

Then(/^I should see (\d+) columns$/, function (numberOfColumns) {
  return this.app.client
    .element('.editor.handsontable')
    .elements('.ht_master table tr:first-child td')
    .then(function(response) {
      expect(response.value.length).to.equal(numberOfColumns)
    })
})
