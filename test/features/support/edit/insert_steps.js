import { expect } from 'chai'
import { Given, When, Then } from 'cucumber'
import { getNumberOfColumns, getNumberOfRows } from '../page-objects/dimensions'

Given(/^the user clicks in row (\d+), column (\d+)$/, function (rowNumber, colNumber) {
  this.rowNumber = rowNumber
  this.colNumber = colNumber
  return this.app.webContents.send('selectHotCell', rowNumber, colNumber)
})

When(/^the user (?:performs a |)right-click[s]?$/, function () {
  return this.app.client
    .rightClick('.ht_master table')
})

Then(/^the user clicks (?:on|in) "Insert ([Rr]ow|[Cc]olumn) ([bB]elow|[Aa]bove|[Bb]efore|[Aa]fter)"$/, function (rowOrColumn, place) {
  return this.app
    .webContents.send('clickLabelOnContextMenu', `Insert ${rowOrColumn.toLowerCase()} ${place.toLowerCase()}`)
})

Then(/^there should be (\d+) new row[s]? (?:above|below) the current row$/, async function (numberOfNew) {
  let actual = await getNumberOfRows(this.app)
  expect(actual).to.equal(this.rowNumber + numberOfNew)
})

Then(/^there should be (\d+) new column[s]? (?:before|after) the current column$/, async function (numberOfNew) {
  let actual = await getNumberOfColumns(this.app)
  expect(actual).to.equal(this.colNumber + numberOfNew)
})

Then(/^there should be (\d+) row[s]?$/, async function (expectedNumber) {
  let actual = await getNumberOfRows(this.app)
  expect(actual).to.equal(expectedNumber)
})

Then(/^there should be (\d+) column[s]?$/, async function (expectedNumber) {
  let actual = await getNumberOfColumns(this.app)
  expect(actual).to.equal(expectedNumber)
})
