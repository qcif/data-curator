import { getActiveTableSelector } from './selectors'

export async function tableRowAndColCount (app) {
  const tableRowCount = getNumberOfRows(app)
  const tableColCount = getNumberOfColumns(app)
  return { tableRowCount, tableColCount }
}

export async function getNumberOfColumns (app) {
  const response = await app.client
    .element(getActiveTableSelector())
    .elements('.ht_master table tr:first-child td')
  return response.value.length
}

export async function getNumberOfRows (app) {
  const response = await app.client
    .element(getActiveTableSelector())
    .elements('.ht_master table tr th')
  return response.value.length
}
