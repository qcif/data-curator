import _ from 'lodash'
import { collectWithFn, waitForDisplayedDefault } from './helpers'

export async function waitForVisibleIdFromLabel (app, parentSelector, label, timeout) {
  const kebabCase = _.kebabCase(label)
  const camelCase = _.camelCase(label)
  try {
    const el = await app.client.$(`${parentSelector} #${kebabCase}`)
    await el.waitforDisplayed(timeout)
    return el
  } catch (error) {
    console.log(`Unable to find via ID kebabCase Trying ID camelCase...`)
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
    console.log(`Unable to find via ID kebabCase Trying ID camelCase...`)
    return app.client.$(`input#${camelCase}`)
  }
}

export async function applyFnToIdOrClassSelectorFromLabel (app, fn, label, timeout) {
  try {
    await applyFnToSelectorWithLabel(app, fn, '.' + label, label, timeout)
  } catch (error) {
    console.log(`Unable to find via class. Trying id`)
    await applyFnToSelectorWithLabel(app, fn, '#' + label, label, timeout)
  }
}

export async function applyFnToSelectorWithLabel (app, fn, selector, label, timeout) {
  const selectors = replaceLabelWithKebabAndCamelCase(selector, label)
  await applyFnToOneOfDualSelectors(app, fn, selectors[0], selectors[1], timeout)
}

// apply function that has no return value
export async function applyFnToOneOfDualSelectors (app, fn, selector1, selector2, timeout) {
  try {
    const el = await app.client.$(selector1)
    await el.waitForDisplayed({ timeout: timeout })
    await el[fn]()
  } catch (error) {
    console.log(`Unable to find via ${selector1} Trying ${selector2}`)
    const el = await app.client.$(selector2)
    await el.waitForDisplayed({ timeout: timeout })
    await el[fn]()
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

export async function getCurrentColumnCellsTextResults (app, currentColumnSelector) {
  const columnCells = await (await app.client.$(activeTableSelector)).$$(currentColumnSelector)
  const columnCellsText = await collectWithFn(columnCells, 'getText')
  return columnCellsText
}

export async function getBackgroundColorOfCellsInCurrentColumn (app, currentColumnSelector) {
  const columnCells = await (await app.client.$(activeTableSelector)).$$(currentColumnSelector)
  return collectWithFn(columnCells, 'getCSSProperty', 'backgroundColor')
}

export async function getCurrentColumnSelector (app) {
  const collectedRows = await (await app.client.$(activeTableSelector)).$$(rowSelector)
  for (const [index, row] of collectedRows.entries()) {
    const selector = `.ht_master table tr:nth-of-type(${index + 1}) td`
    const collectedCells = await (await app.client.$(activeTableSelector)).$$(selector)
    if (!_.isEmpty(collectedCells)) {
      const collectedCellClasses = await collectWithFn(collectedCells, 'getAttribute', 'class')
      const currentColIndex = collectedCellClasses.findIndex(value => /.*htSearchResult.*/.test(value))
      if (currentColIndex !== -1) {
        return `.ht_master table tr td:nth-of-type(${currentColIndex + 1})`
      }
    }
  }
}

export async function getPlaceholderValue (app, idName) {
  const findInputParent = await (await app.client.$(`#${idName}`)).$('..')
  const attributeTarget = await findInputParent.getAttribute('data-placeholder')
  return attributeTarget
}

export async function displayActiveTable (app) {
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
const headerCellSelector = '.ht_master table thead tr:first-of-type th span:not(.cornerHeader)'
// hot has column headers and row headers
const rowHeaderCellSelector = '.ht_master table tr th'
const rowSelector = '.ht_master table tr'
const cellSelector = '.ht_master table tr td'
const selectedRowHeaderClass = 'ht__highlight'
const selectedCellClass = 'current highlight'
const toolbarMenuButtonSelector = '#toolbar .toolbar-text'

export {
  activeTableSelector,
  headerCellSelector,
  cellSelector,
  selectedRowHeaderClass,
  selectedCellClass,
  toolbarMenuButtonSelector,
  rowSelector,
  rowHeaderCellSelector
}
