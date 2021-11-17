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

async function getColumnElementsInCurrentRow (app) {
  const el = await (await (await app.client.$(activeTableSelector)).$('.ht_master table tbody tr th.ht__highlight')).$('..')
  return el.$$('td')
}

async function getAllRowHeaders (app) {
  const el = await app.client.$(activeTableSelector)
  return el.$$('.ht_master table tbody tr th')
}
