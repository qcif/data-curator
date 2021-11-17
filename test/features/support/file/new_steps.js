import { expect } from 'chai'
import { Given, Then, When } from 'cucumber'
import _ from 'lodash'
import {
  activeTabElement,
  activeTableElement,
  activeTableSelector,
  allTabElements,
  cellSelector,
  displayActiveTable,
  headerCellSelector,
  rowSelector, selectedCellClass,
  selectedRowHeaderClass
} from '../page-objects/selectors'
import { collectText, collectWithFn } from '../page-objects/helpers'
import {
  expectActiveTableToHoldExpectedDataWithHeaderIncluded,
  expectActiveTableToHoldExpectedDataWithNoHeaderIncluded, isDataEqualToDefaultData
} from '../page-objects/data'

When(/^Data Curator is open$/, async function () {
  await displayActiveTable(this.app)
  const title = await this.app.client.getTitle()
  expect(title).to.equal('Data Curator')
})

Given(/^the active table has data: "(.+)"$/, async function (data) {
  const activeTable = await activeTableElement(this.app)
  if (isDataEqualToDefaultData(data)) {
    console.log(`empty set`)
    await expectActiveTableToHoldExpectedDataWithNoHeaderIncluded(activeTable, data)
  } else {
    await this.app.webContents.send('loadDataIntoCurrentHot', data)
    // include headers in data sent
    await expectActiveTableToHoldExpectedDataWithHeaderIncluded(activeTable, data)
  }
})

Then(/^expect the active table to have data: "(.+)"$/, async function (data) {
  // include headers in data sent
  const activeTable = await activeTableElement(this.app)
  await expectActiveTableToHoldExpectedDataWithHeaderIncluded(activeTable, data)
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

Then(/^the cursor (?:should be|is) in the (?:new |)table$/, async function () {
  const els = await (await activeTableElement(this.app)).$$(cellSelector)
  const collected = await collectWithFn(els, 'getAttribute', 'class')
  console.log(`collected is ${JSON.stringify(collected)}`)
  expect(collected).to.contain(selectedCellClass)
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
