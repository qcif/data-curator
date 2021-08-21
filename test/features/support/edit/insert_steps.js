import { expect } from 'chai'
import { Given, When, Then } from 'cucumber'
import {
  getIndexOfCurrentColumnInCurrentRow,
  getIndexOfCurrentRowInRows,
  getNumberOfColumns,
  getNumberOfRows
} from '../page-objects/dimensions'

Given(/^the user clicks in row (\d+), column (\d+)$/, async function (rowNumber, colNumber) {
  this.rowNumber = rowNumber
  this.colNumber = colNumber
  this.rowCount = await getNumberOfRows(this.app)
  this.colCount = await getNumberOfColumns(this.app)
  await this.app.webContents.send('selectHotCell', rowNumber, colNumber)
})

When(/^the user types "(.*?)"?$/, async function (textEntered) {
  await this.app.client.keys(textEntered)
  await this.app.client.pause(2000)
})

When(/^the user (?:performs a |)right-click[s]?$/, async function () {
  await this.app.client.rightClick('.ht_master table')
})

Then(/^the user clicks (?:on|in) "Insert (Row|Column) (Below|Above|Before|After)"$/, function (rowOrColumn, place) {
  console.log(`${rowOrColumn} ${place}`)
  return this.app
    .webContents.send('clickLabelOnContextMenu', `Insert ${rowOrColumn} ${place}`)
})

Then(/^the text: "(.+?)" should be in row (\d+) column (\d+)$/, async function (expectedText, expectedRow, expectedColumn) {
  let textFound = await this.app.client.elements(`.ht_master table tr:nth-of-type(${expectedRow}) td:nth-of-type(${expectedColumn})`).getText()
  let allText = await this.app.client.elements('.ht_master table').getText()
  expect(textFound).to.equal(allText)
  expect(textFound).to.equal(expectedText)
  expect(textFound.length).to.be.greaterThan(0)
})

Then(/^there should be (\d+) new row[s]? above the current row$/, async function (numberOfNew) {
  let currentRowNumber = await getIndexOfCurrentRowInRows(this.app) + 1
  expect(currentRowNumber).to.equal(this.rowNumber + numberOfNew)
  let numberOfRows = await getNumberOfRows(this.app)
  expect(numberOfRows).to.equal(this.rowCount + numberOfNew)
})

Then(/^there should be (\d+) new column[s]? before the current column$/, async function (numberOfNew) {
  let currentColumnNumber = await getIndexOfCurrentColumnInCurrentRow(this.app) + 1
  expect(currentColumnNumber).to.equal(this.colNumber + numberOfNew)
  let numberOfColumns = await getNumberOfColumns(this.app)
  expect(numberOfColumns).to.equal(this.colCount + numberOfNew)
})

Then(/^there should be (\d+) new column[s]? below the current row$/, async function (numberOfNew) {
  let currentRowNumber = await getIndexOfCurrentRowInRows(this.app) + 1
  expect(currentRowNumber).to.equal(this.rowNumber)
  let numberOfRows = await getNumberOfRows(this.app)
  expect(numberOfRows).to.equal(this.rowCount + numberOfNew)
})

Then(/^there should be (\d+) new column[s]? after the current column$/, async function (numberOfNew) {
  let currentColumnNumber = await getIndexOfCurrentColumnInCurrentRow(this.app) + 1
  expect(currentColumnNumber).to.equal(this.colNumber)
  let numberOfColumns = await getNumberOfColumns(this.app)
  expect(numberOfColumns).to.equal(this.colCount + numberOfNew)
})

Then(/^the (?:new |)table (?:should have |has )(\d+) row[s]? by (\d+) column[s]?$/, async function (rowCount, colCount) {
  let actualRowCount = await getNumberOfRows(this.app)
  expect(actualRowCount).to.equal(rowCount)
  let actualColumnCount = await getNumberOfColumns(this.app)
  expect(actualColumnCount).to.equal(colCount)
})

Then(/^there should be (\d+) row[s]?$/, async function (expectedNumber) {
  let actual = await getNumberOfRows(this.app)
  expect(actual).to.equal(expectedNumber)
})

Then(/^there should be (\d+) column[s]?$/, async function (expectedNumber) {
  let actual = await getNumberOfColumns(this.app)
  expect(actual).to.equal(expectedNumber)
})
