import { expect } from 'chai'
import { Given, Then, When } from 'cucumber'
import { defaultTabData, isDataEqualToDefaultData } from '../page-objects/io.js'
import _ from 'lodash'
import {
  activeTableElement,
  activeTableSelector,
  displayActiveTable,
  cellSelector,
  headerSelector,
  selectedRowHeaderClass, activeTabElement, allTabElements
} from '../page-objects/selectors'
import { collectText, collectWithFn } from '../page-objects/helpers'

When(/^Data Curator is open$/, async function () {
  await displayActiveTable(this.app)
  const title = await this.app.client.getTitle()
  expect(title).to.equal('Data Curator')
})

Given(/^the active table has data: "(.+)"$/, async function (data) {
  // include headers in data sent
  await this.app.webContents.send('loadDataIntoCurrentHot', data)
  // wait until hot data changes before continuing
  const parentSelector = '.tab-pane.active .editor.handsontable'
  const elementsSelector = '.ht_master table tr:first-of-type td'
  let self = this
  let actualFirstDataRow
  await this.app.client.waitUntil(async function () {
    actualFirstDataRow = await self.app.client.element(parentSelector)
      .elements(elementsSelector)
      .getText()
    return _.difference(data[0], actualFirstDataRow).length === 0
  }, 5000)
  const difference = _.difference(actualFirstDataRow, defaultTabData[0])

  if (isDataEqualToDefaultData(data)) {
    expect(difference.length).to.equal(0)
  } else {
    // the first row (as headers will be toggled) matches default data first row
    if (difference.length === 0) {
      expect(data.length).to.not.equal(defaultTabData.length)
    } else {
      expect(difference.length).to.not.equal(0)
    }
  }
})

Then(/^1 window should be displayed/, async function () {
  await this.app.client.waitUntilWindowLoaded()
  const windowCount = await this.app.client.getWindowCount()
  expect(windowCount).to.equal(1)
})

Then(/^(the window (?:should have|has|have) (\d+) tab[s]?|(\d+) (?:data )tab[s]? is displayed)$/, async function (numberOfTabs) {
  await displayActiveTable(this.app)
  const response = await this.app.client.$$('.tab-header')
  expect(response.length).to.equal(_.toInteger(numberOfTabs))
})

Then(/^the (?:new |)tab should be in the right-most position$/, async function () {
  await displayActiveTable(this.app)
  const els = await (await this.app.client.$('#csvEditor')).$$('.tab-header')
  const el = els[els.length - 1]
  const elAttribute = await el.getAttribute('class')
  expect(elAttribute).to.contain('active')
})

Then(/^the (?:new |)tab should have a unique name$/, async function () {
  await displayActiveTable(this.app)
  const activeEl = await activeTabElement(this.app)
  const activeElText = await activeEl.getText()
  const els = await allTabElements(this.app)
  let matchingNameCount = 0
  for (const nextEl of els) {
    const nextText = await nextEl.getText()
    if (nextText === activeElText) {
      matchingNameCount++
    }
  }
  expect(matchingNameCount).to.equal(1)
})

Then(/^the (?:new |)tab should have 1 table$/, async function () {
  await displayActiveTable(this.app)
  const response = await this.app.client.$$('.tab-content')
  expect(response.length).to.equal(1)
  const response2 = await this.app.client.$$(activeTableSelector)
  expect(response.length).to.equal(1)
})

Then(/^the (?:new |)table (?:should be|is) empty$/, async function () {
  const els = await (await activeTableElement(this.app)).$$(cellSelector)
  const collected = await collectText(els)
  expect(collected.join('')).to.equal('')
})

Then(/^the cursor (?:should be|is) in the (?:new )table$/, async function () {
  const els = await (await activeTableElement(this.app)).$$(headerSelector)
  const collected = []
  for (const nextEl of els) {
    const attr = await nextEl.getAttribute('class')
    collected.push(attr)
  }
  expect(collected).to.contain(selectedRowHeaderClass)
})

Then(/^the cursor (?:should be|is) in row (\d+), column (\d+)$/, async function (rowNumber, colNumber) {
  // const els = await (await activeTableElement(this.app)).$$(headerSelector)
  // const collected = await collectWithFn(els, 'getAttribute', 'class')
  // expect(collected[rowNumber - 1]).to.contain(selectedRowHeaderClass)
  //
  // const els2 = await (await activeTableElement(this.app)).$$(`.ht_master table tr:nth-child(${rowNumber}) td`)
  // const collected2 = []
  // for (const nextEl of els2) {
  //   const attr = await nextEl.getAttribute('class')
  //   collected2.push(attr)
  // }
  // expect(collected2[colNumber - 1]).to.contain(selectedCellClass)
})
