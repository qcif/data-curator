import { expect } from 'chai'
import { Given, Then, When } from 'cucumber'
import {
  getIndexOfCurrentColumnInCurrentRow,
  getIndexOfCurrentRowInRows,
  getNumberOfColumns,
  getNumberOfRows
} from '../page-objects/dimensions'
import { collectText, collectWithFn } from '../page-objects/helpers'

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

// Spectron/WebdriverIO won't work with context-menu (and can't close it) once it appears - so just call the menu
Then(/^the user clicks (?:on|in) "Insert (Row|Column) (Below|Above|Before|After)" in the context menu$/, async function (rowOrColumn, place) {
  let actualRowCount = await getNumberOfRows(this.app)
  let actualColumnCount = await getNumberOfColumns(this.app)
  this.app.webContents.send('clickLabelOnContextMenu', `Insert ${rowOrColumn} ${place}`)
})

Then(/^the text: "(.+?)" should be in row (\d+) column (\d+)$/, async function (expectedText, expectedRow, expectedColumn) {
  const els = await this.app.client.$$(`.ht_master table tr:nth-of-type(${expectedRow}) td:nth-of-type(${expectedColumn})`)
  const textCollected = await collectText(els)
  const textFound = textCollected.join()
  let allEls = await this.app.client.$$('.ht_master table')
  const allTextCollected = await collectText(allEls)
  const allTextFound = allTextCollected.join()
  expect(textFound).to.equal(allTextFound)
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
