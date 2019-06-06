import { expect } from 'chai'
import { Given, When, Then } from 'cucumber'

Given(/^the user clicks in row (\d+), column (\d+)$/, function (rowNumber, colNumber) {
  this.rowNumber = rowNumber
  this.colNumber = colNumber
  return this.app.webContents.send('selectHotCell', rowNumber, colNumber)
})

When(/^the user (?:performs a |)right-click[s]?$/, function () {
  return this.app.client
    .rightClick('.ht_master table')
})

Then(/^the user clicks (?:on|in) "Insert Row Below"$/, function () {
  return this.app
    .webContents.send('clickLabelOnContextMenu', 'Insert row below')
})

Then(/^there should be (\d+) new row[s]? below the current row$/, function (numberOfNewRows) {
  let worldRowNumber = this.rowNumber
  return this.app.client
    .element('.editor.handsontable')
    .elements('.ht_master table tr th')
    .then(function(response) {
      expect(response.value.length).to.equal(worldRowNumber + numberOfNewRows)
    })
})

Then(/^there should be (\d+) column(?:s)$/, function (numberOfColumns) {
  return this.app.client
    .element('.editor.handsontable')
    .elements('.ht_master table tr:first-child td')
    .then(function(response) {
      expect(response.value.length).to.equal(numberOfColumns)
    })
})
