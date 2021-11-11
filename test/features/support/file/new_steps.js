import { expect } from 'chai'
import { Given, When, Then } from 'cucumber'
import { defaultTabData, isDataEqualToDefaultData } from '../page-objects/io.js'
import _ from 'lodash'
import { activeTableSelector } from '../page-objects/selectors'

When(/^Data Curator is open$/, async function () {
  await this.app.client.waitUntilWindowLoaded()
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
  await this.app.client.waitUntilWindowLoaded()
  const el = await this.app.client.$('#csvEditor')
  await el.waitForDisplayed({ timeout: 5000 })
  const response = await this.app.client.$$('.tab-header')
  expect(response.length).to.equal(_.toInteger(numberOfTabs))
})

Then(/^the (?:new |)tab should be in the right-most position$/, function () {
  return this.app.client
    .waitForVisible('#csvEditor')
    .getAttribute('.tab-header', 'class')
    .then(function (response) {
      let lastTab = response.length - 1
      expect(response[lastTab]).to.contain('active')
    })
})

Then(/^the (?:new |)tab should have a unique name$/, async function () {
  const activeText = await this.app.client
    .waitForVisible('#csvEditor')
    .getText('.tab-header.active')
  let allText = await this.app.client
    .waitForVisible('#csvEditor')
    .getText('.tab-header')
  _.pull(allText, activeText)
  expect(allText).to.not.contain(activeText)
})

Then(/^the (?:new |)tab should have 1 table$/, async function () {
  await this.app.client.waitUntilWindowLoaded()
  const el = await this.app.client.$('#csvEditor')
  await el.waitForDisplayed({ timeout: 5000 })
  const response = await this.app.client.$$('.tab-content')
  expect(response.length).to.equal(1)
  const response2 = await this.app.client.$$('.active .editor.handsontable')
  expect(response.length).to.equal(1)
})

Then(/^the (?:new |)table (?:should be|is) empty$/, async function () {
  const els = await (await this.app.client.$('.active .editor.handsontable')).$$('.ht_master table tr td')
  const collected = []
  for (const el of els) {
    const nextText = await el.getValue()
    collected.push(nextText)
  }
  expect(collected.join('')).to.equal('')
})

Then(/^the cursor (?:should be|is) in the (?:new )table$/, async function () {
  const el = await (await this.app.client.$('.active .editor.handsontable')).$('.ht_master table tr th')
  const elAttribute = el.getAttribute()
  const selectedRowHeaderClass = 'ht__highlight'
  expect(response).to.contain(selectedRowHeaderClass)
})

Then(/^the cursor (?:should be|is) in row (\d+), column (\d+)$/, async function (rowNumber, colNumber) {
  const parentSelector = activeTableSelector
  const parentElement = await this.app.client.$(parentSelector)
  const els = await parentElement.$$('.ht_master table tr th')
  const collected = []
  for (const nextEl of els) {
    const attr = await nextEl.getAttribute('class')
    collected.push(attr)
  }
  const selectedRowHeaderClass = 'ht__highlight'
  expect(collected[rowNumber - 1]).to.contain(selectedRowHeaderClass)

  const els2 = await parentElement.$$(`.ht_master table tr:nth-child(${rowNumber}) td`)
  const collected2 = []
  for (const nextEl of els2) {
    const attr = await nextEl.getAttribute('class')
    collected2.push(attr)
  }
  const selectedCellClass = 'current highlight'
  expect(collected2[colNumber - 1]).to.contain(selectedCellClass)
})
