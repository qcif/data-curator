import _ from 'lodash'
import { waitForDisplayedDefault } from './helpers'

export async function waitForVisibleIdFromLabel (app, parentSelector, label, timeout) {
  const kebabCase = _.kebabCase(label)
  const camelCase = _.camelCase(label)
  try {
    const el = await app.client.$(`${parentSelector} #${kebabCase}`)
    await el.waitforDisplayed(Z)
    return el
  } catch (error) {
    console.log(`Unable to find via ${kebabCase} Trying ${camelCase}...`)
    const el = await app.client.$(`${parentSelector} #${camelCase}`)
    await waitForDisplayedDefault(el)
    return el
  }
}

export async function returnInputIdSelector (app, selector) {
  const kebabCase = _.kebabCase(selector)
  const camelCase = _.camelCase(selector)
  try {
    return app.client.$(`input#${kebabCase}`)
  } catch (error) {
    console.log(`Unable to find via ${kebabCase} Trying ${camelCase}`)
    return app.client.$(`input#${camelCase}`)
  }
}

export async function applyFnToIdOrClassSelectorFromLabel (app, fn, label, timeout) {
  try {
    return applyFnToSelectorWithLabel(app, fn, '.' + label, label, timeout)
  } catch (error) {
    console.log(`Unable to find via class. Trying id`)
    return applyFnToSelectorWithLabel(app, fn, '#' + label, label, timeout)
  }
}

export async function applyFnToSelectorWithLabel (app, fn, selector, label, timeout) {
  const selectors = replaceLabelWithKebabAndCamelCase(selector, label)
  return applyFnToOneOfDualSelectors(app, fn, selectors[0], selectors[1], timeout)
}

export async function applyFnToOneOfDualSelectors (app, fn, selector1, selector2, timeout) {
  try {
    const el = await app.client.$(selector1)
    await el.waitForDisplayed({ timeout: timeout })
    return el[fn]()
  } catch (error) {
    console.log(`Unable to find via ${selector1} Trying ${selector2}`)
    const el = await app.client.$(selector2)
    await el.waitForDisplayed({ timeout: timeout })
    return el[fn]()
  }
}

export function replaceLabelWithKebabAndCamelCase (selector, toReplace) {
  const kebabCaseSelector = _.replace(selector, toReplace, _.kebabCase(toReplace))
  const camelCaseSelector = _.replace(selector, toReplace, _.camelCase(toReplace))
  return [kebabCaseSelector, camelCaseSelector]
}

export function kebabAndCamelCase (selector) {
  const kebabCase = _.kebabCase(selector)
  const camelCase = _.camelCase(selector)
  return { kebabCase, camelCase }
}

export async function countNumberOfCurrentColumnCellsWithText (app, hotParentSelector, currentColumnSelector) {
  return app.client.element(hotParentSelector).getText(currentColumnSelector)
}

export async function getBackgroundColorOfCurrentColumn (app, hotParentSelector, currentColumnSelector) {
  return app.client.element(hotParentSelector).getCssProperty(currentColumnSelector, 'backgroundColor')
}

export async function getCurrentColumnSelector (app, hotParentSelector) {
  const activeCol = await app.client.element(hotParentSelector).getAttribute('.ht_master table thead tr:first-of-type th', 'class')
  // account for corner header
  const currentCol = _.indexOf(activeCol, 'ht__highlight')
  return `.ht_master table tr td:nth-of-type(${currentCol})`
}

export async function getPlaceholderValue (app, idName) {
  const findInputParent = await app.client.element(`#${idName}`).element('..')
  const attributeTarget = await app.client.elementIdAttribute(findInputParent.value.ELEMENT, 'data-placeholder')
  return attributeTarget.value
}

export async function displayActiveTable (app) {
  await app.client.waitUntilWindowLoaded()
  const el = await activeTableElement(app)
  await waitForDisplayedDefault(el)
}

export async function activeTabElement (app) {
  return (await app.client.$('#csvEditor')).$('.tab-header.active')
}

export async function allTabElements (app) {
  return (await app.client.$('#csvEditor')).$$('.tab-header')
}

export async function activeTableElement (app) {
  return (await app.client.$('#csvEditor')).$(activeTableSelector)
}

const activeTableSelector = '.tab-pane.active .editor.handsontable'
const headerSelector = '.ht_master table tr th'
const cellSelector = '.ht_master table tr td'
const selectedRowHeaderClass = 'ht__highlight'
const selectedCellClass = 'current highlight'
const toolbarMenuButtonSelector = '#toolbar .toolbar-text'

export {
  activeTableSelector,
  headerSelector,
  cellSelector,
  selectedRowHeaderClass,
  selectedCellClass,
  toolbarMenuButtonSelector
}
