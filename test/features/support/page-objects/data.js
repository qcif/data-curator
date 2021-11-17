import _ from 'lodash'
import { collectWithFn, waitForDisplayedDefault } from './helpers'
import { activeTableElement, cellSelector, headerCellSelector } from './selectors'
import { expect } from 'chai'

export function isDataEqualToDefaultData (data) {
  // NB: arrays might contain mix of quotes
  const sanitisedDefault = _.compact(_.flatten(defaultTabData))
  const sanitisedData = _.compact(_.flatten(JSON.parse(data)))
  // TODO: brittle as check only works while default is no data
  return sanitisedDefault.length === 0 && sanitisedDefault.length === sanitisedData.length
}

export async function expectActiveTableToHoldExpectedDataWithHeaderIncluded (activeTable, data) {
  const expectedData = JSON.parse(data)
  const expectedHeader = expectedData.shift()
  const headerCells = await (activeTable).$$(headerCellSelector)
  console.log(`got header cells: ${headerCells}`)
  console.log(`got header cells length: ${headerCells.length}`)
  for (const [index, expectedHeaderCell] of expectedHeader.entries()) {
    let actualText
    await headerCells[index].waitUntil(async function () {
      // not 'interactable' so getText may not work
      actualText = await this.getHTML(false)
      return actualText === expectedHeaderCell
    })
  }

  const els = await (activeTable).$$(cellSelector)
  for (const [index, expectedRowText] of expectedData.entries()) {
    for (const expectedText of expectedRowText) {
      const actualCell = els.shift()
      const actualText = await actualCell.getText()
      expect(actualText).to.equal(expectedText)
    }
  }
}

export async function expectActiveTableToHoldExpectedDataWithNoHeaderIncluded (activeTable, data) {
  const expectedData = JSON.parse(data)

  const els = await (activeTable).$$(cellSelector)
  for (const [index, expectedRowText] of expectedData.entries()) {
    for (const expectedText of expectedRowText) {
      const actualCell = els.shift()
      const actualText = await actualCell.getText()
      expect(actualText).to.equal(expectedText)
    }
  }
}

const defaultTabData = [['', '', '']]

export {
  defaultTabData
}
