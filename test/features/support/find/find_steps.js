import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
import { applyFnToSelectorWithLabel } from '../page-objects/selectors.js'
import { menu } from '../pageObjects.js'
const _ = require('lodash')
const searchColor = 'rgba(252,237,217,1)'

Given(/^"Find" is invoked/, async function () {
  console.log(`menu is`, menu)
  await menu.invokeActions(this.app, {name: 'Find', type: 'application menu selection', sequence: 'Find->Find'})
})

Given(/^"(.+?)" has been entered/, async function (value) {
  await this.app.client.element('input#find').click()
  await this.app.client.keys(value)
  await this.app.client.pause(4000)
})

Then(/^a prompt for (?:a|the) "(find|replace)" value should be displayed/, function (findOrReplace) {
  return this.app.client.waitForVisible(`#${findOrReplace}`)
})

Then(/^the "([\w ]+?)" panel's first input (?:box |)should have focus/, {timeout: -1}, async function (panelName) {
  return applyFnToSelectorWithLabel(this.app, 'hasFocus', `form#${panelName} input:first-of-type`, panelName, this.pageTimeout)
})

Then(/^all the cells with values that match the "(.+?)" should be highlighted/, async function (searchValue) {
  const activeCol = await this.app.client.element(this.hotParentSelector).getAttribute('.ht_master table thead tr:first-of-type th', 'class')
  // account for corner header
  const currentCol = _.indexOf(activeCol, 'ht__highlight')
  const colSelector = `.ht_master table tr td:nth-of-type(${currentCol})`
  const colTexts = await this.app.client.element(this.hotParentSelector).getText(colSelector)
  const backgroundColors = await this.app.client.element(this.hotParentSelector).getCssProperty(colSelector, 'backgroundColor')
  expect(backgroundColors.length).to.equal(colTexts.length)

  const foundColTexts = []
  for (const [index, next] of colTexts.entries()) {
    if (next.includes(searchValue)) {
      foundColTexts.push(index)
    }
  }
  const foundBackgroundColors = []
  for (const [index, next] of backgroundColors.entries()) {
    if (next.value === searchColor) {
      foundBackgroundColors.push(index)
    }
  }
  expect(foundBackgroundColors.length).to.equal(foundColTexts.length)
  expect(_.difference(foundBackgroundColors, foundColTexts).length).to.equal(0)
})
