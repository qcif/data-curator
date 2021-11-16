import _ from 'lodash'
import { collectWithFn, waitForDisplayedDefault } from './helpers'
import { activeTableElement, cellSelector, headerCellSelector } from './selectors'
import { expect } from 'chai'

export async function expectActiveTableToHoldExpectedData (activeTable, data) {
  const expectedData = JSON.parse(data)
  const expectedHeader = expectedData.shift()
  const headerCells = await (activeTable).$$(headerCellSelector)
  // hot data made need time to change before continuing
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
