import store from '../renderer/store/modules/hots.js'

export function includeHeadersInData(hot) {
  let allData = hot.getData()
  if (hot.hasColHeaders()) {
    let headers = hot.getColHeader()
    allData = _.concat([headers], allData)
  }
  return allData
}

export function hasAllColumnNames(hotId, columnProperties) {
  let names = store.getters.getAllHotColumnNamesFromHotId(store.state, store.getters)(hotId)
  return hasAllValidColumnProperty(names, columnProperties)
}

export function hasAllColumnTypes(hotId, columnProperties) {
  let types = store.getters.getAllHotColumnTypesFromHotId(store.state, store.getters)(hotId)
  return hasAllValidColumnProperty(types, columnProperties)
}

function hasAllValidColumnProperty(values, columnProperties) {
  let validValues = _.without(values, undefined, null, '')
  return validValues.length === columnProperties.length
}
