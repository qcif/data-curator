import { expect } from 'chai'
import { Then, When } from 'cucumber'
import {
  applyFnToSelectorWithLabel,
  countNumberOfCurrentColumnCellsWithText,
  getBackgroundColorOfCurrentColumn,
  getCurrentColumnSelector, getPlaceholderValue
} from '../page-objects/selectors'
import {
  getRowIndicesOfFoundBackgroundColors,
  getRowIndicesOfCaseInsensitiveSearchText, getRowIndicesOfCaseSensitiveSearchText
} from '../page-objects/find'

const _ = require('lodash')

Then(/^a prompt for (?:a|the) "(find|replace)" value should be displayed/, function (findOrReplace) {
  return this.app.client.waitForVisible(`#${findOrReplace}`)
})

Then(/^the "([\w ]+?)" panel's first input (?:box |)should have focus/, { timeout: -1 }, async function (panelName) {
  return applyFnToSelectorWithLabel(this.app, 'hasFocus', `form#${panelName} input:first-of-type`, panelName, this.pageTimeout)
})

Then(/^all the cells with values that are a case sensitive match for "(.+?)" should be highlighted/, async function (searchValue) {
  const currentColumnSelector = await getCurrentColumnSelector(this.app, this.hotParentSelector)
  const currentColumnCellsWithText = await countNumberOfCurrentColumnCellsWithText(this.app, this.hotParentSelector, currentColumnSelector)
  const backgroundColors = await getBackgroundColorOfCurrentColumn(this.app, this.hotParentSelector, currentColumnSelector)
  expect(backgroundColors.length).to.equal(currentColumnCellsWithText.length)
  // the test makes a case-insensitive match
  const matchedTextIndices = getRowIndicesOfCaseSensitiveSearchText(currentColumnCellsWithText, searchValue)
  const backgroundColorIndices = getRowIndicesOfFoundBackgroundColors(backgroundColors)
  expect(backgroundColorIndices.length).to.equal(matchedTextIndices.length)
  expect(_.difference(backgroundColorIndices, matchedTextIndices).length).to.equal(0)
})

Then(/^all the cells with values that are a case insensitive match for "(.+?)" should be highlighted/, async function (searchValue) {
  const currentColumnSelector = await getCurrentColumnSelector(this.app, this.hotParentSelector)
  const currentColumnCellsWithText = await countNumberOfCurrentColumnCellsWithText(this.app, this.hotParentSelector, currentColumnSelector)
  const backgroundColors = await getBackgroundColorOfCurrentColumn(this.app, this.hotParentSelector, currentColumnSelector)
  expect(backgroundColors.length).to.equal(currentColumnCellsWithText.length)
  // the test makes a case-insensitive match
  const matchedTextIndices = getRowIndicesOfCaseInsensitiveSearchText(currentColumnCellsWithText, searchValue)
  const backgroundColorIndices = getRowIndicesOfFoundBackgroundColors(backgroundColors)
  expect(backgroundColorIndices.length).to.equal(matchedTextIndices.length)
  expect(_.difference(backgroundColorIndices, matchedTextIndices).length).to.equal(0)
})

Then(/^the remaining case-sensitive cells with values that match (?:the |)"(.+?)" should be 1 less than highlighted/, async function (searchValue) {
  const currentColumnSelector = await getCurrentColumnSelector(this.app, this.hotParentSelector)
  const currentColumnCellsWithText = await countNumberOfCurrentColumnCellsWithText(this.app, this.hotParentSelector, currentColumnSelector)
  const backgroundColors = await getBackgroundColorOfCurrentColumn(this.app, this.hotParentSelector, currentColumnSelector)
  expect(backgroundColors.length).to.equal(currentColumnCellsWithText.length)
  const matchedTextIndices = getRowIndicesOfCaseSensitiveSearchText(currentColumnCellsWithText, searchValue)
  const backgroundColorIndices = getRowIndicesOfFoundBackgroundColors(backgroundColors)
  expect(matchedTextIndices.length).to.equal(backgroundColorIndices.length - 1)
  expect(_.difference(backgroundColorIndices, matchedTextIndices).length).to.equal(1)
})

Then(/^the remaining case-insensitive cells with values that match (?:the |)"(.+?)" should be 1 less than highlighted/, async function (searchValue) {
  const currentColumnSelector = await getCurrentColumnSelector(this.app, this.hotParentSelector)
  const currentColumnCellsWithText = await countNumberOfCurrentColumnCellsWithText(this.app, this.hotParentSelector, currentColumnSelector)
  const backgroundColors = await getBackgroundColorOfCurrentColumn(this.app, this.hotParentSelector, currentColumnSelector)
  expect(backgroundColors.length).to.equal(currentColumnCellsWithText.length)
  const matchedTextIndices = getRowIndicesOfCaseInsensitiveSearchText(currentColumnCellsWithText, searchValue)
  const backgroundColorIndices = getRowIndicesOfFoundBackgroundColors(backgroundColors)
  expect(matchedTextIndices.length).to.equal(backgroundColorIndices.length - 1)
  expect(_.difference(backgroundColorIndices, matchedTextIndices).length).to.equal(1)
})

Then(/^a count of (?:all |)the (?:remaining |)values that match the "(.+?)" value should be displayed/, async function (findOrReplace) {
  const placeholderText = await getPlaceholderValue(this.app, findOrReplace)
  expect(placeholderText.length).to.be.above(1)
})

Then(/^the "(.+?)" display count should read "(.+?)"/, async function (findOrReplace, displayCountText) {
  const placeholderText = await getPlaceholderValue(this.app, findOrReplace)
  expect(placeholderText).to.equal(displayCountText)
})
