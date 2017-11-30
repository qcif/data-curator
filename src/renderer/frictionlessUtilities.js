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
  let validNames = _.without(names, undefined, null, '')
  return validNames.length === columnProperties.length
}
