
export async function tableRowAndColCount(app) {
  const parentSelector = '.tab-pane.active .editor.handsontable'
  const rowResponse = await app.client.element(parentSelector)
    .elements('.ht_master table tr')
  const tableRowCount = rowResponse.value.length
  const colResponse = await app.client.element(parentSelector)
    .elements('.ht_master table tr:first-of-type td')
  const tableColCount = colResponse.value.length
  return { tableRowCount, tableColCount }
}
