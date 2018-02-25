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
    .then(function() {
      app.webContents.send('clickInsertRowBelow')
    })
})

Then(/^I invoke the "Insert Row Below" command$/, function () {
  return this.app
    .webContents.send('clickLabelOnContextMenu', 'Insert row below')
})

Then(/^I should see a new row below the current row$/, function () {
  return this.app.client
    .element('.editor.handsontable')
    .elements('.ht_master table tr th')
    .then(response => {
      expect(response.value.length).to.equal(this.rowNumber + 1)
    })
})

Then(/^I should see the cursor in the first column$/, function () {
  return this.app.client
    .element('.editor.handsontable')
    .elements('.ht_master table tr td.current.highlight')
    .then(response => {
      expect(response.value.length).to.equal(this.colNumber)
    })
})
