import { activeTableSelector } from './selectors'
import _ from 'lodash'

export async function tableRowAndColCount (app) {
  const tableRowCount = await getNumberOfRows(app)
  const tableColCount = await getNumberOfColumns(app)
  return { tableRowCount, tableColCount }
}

export async function getNumberOfColumns (app) {
  const responseValue = await getColumnElementsInCurrentRow(app)
  return responseValue.length
}

export async function getNumberOfRows (app) {
  const responseValue = await getAllRowHeaders(app)
  return responseValue.length
}

export async function getIndexOfCurrentColumnInCurrentRow (app) {
  const columns = await getColumnsAsClassInCurrentRow(app)
  let currentIndex = _.indexOf(columns, 'current highlight')
  return currentIndex
}

export async function getIndexOfCurrentRowInRows (app) {
  const rows = await getRowsAsClass(app)
  let currentIndex = _.indexOf(rows, 'ht__highlight')
  return currentIndex
}

export async function getColumnsAsClassInCurrentRow (app) {
  const responseValue = await getColumnElementsInCurrentRow(app)
  let columns = await collectClass(app, responseValue)
  return columns
}

export async function getRowsAsClass (app) {
  const responseValue = await getAllRowHeaders(app)
  let rows = await collectClass(app, responseValue)
  return rows
}

async function collectClass (app, collection) {
  let collected = []
  for (let next of collection) {
    let elementClass = await app.client.elementIdAttribute(next.ELEMENT, 'class')
    collected.push(elementClass.value || '')
  }
  return collected
}

// webdriver io v5 onwards means that either you have to group like the below or separate out chains
// https://github.com/webdriverio/webdriverio/blob/f759ba10fcd951e1622844de9b0943eb6cc6f14f/CHANGELOG.md#v500-2018-12-20
async function getColumnElementsInCurrentRow (app) {
  const el = await (await (await app.client.$(activeTableSelector)).$('.ht_master table tbody tr th.ht__highlight')).$('..')
  return el.$$('td')
}

async function getCurrentRowHeader (app) {
  const response = await app.client
    .element(activeTableSelector)
    .element('.ht_master table tbody tr th.ht__highlight')
  return response.value
}

async function getAllRowHeaders (app) {
  const el = await app.client.$(activeTableSelector)
  const response = await el.$$('.ht_master table tbody tr th')
  return response
}
