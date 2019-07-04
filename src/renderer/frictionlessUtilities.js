import store from '@/store/modules/hots.js'
import { DEFAULT_DIALECT } from 'datapackage/lib/config.js'

export function includeHeadersInData (hot) {
  let allData = hot.getData()
  if (hot.hasColHeaders()) {
    let headers = hot.getColHeader()
    allData = _.concat([headers], allData)
  }
  return allData
}

export function hasAllColumnNames (hotId, columnProperties, names) {
  if (isCaseSensitive(hotId)) {
    const uniqueNames = _.uniq(names)
    return hasAllValidColumnProperty(uniqueNames, columnProperties)
  } else {
    const uniqueNames = _.uniqBy(names, _.lowerCase)
    return hasAllValidColumnProperty(uniqueNames, columnProperties)
  }
}

export function getValidNames (hotId) {
  const names = store.getters.getAllHotColumnNamesFromHotId(store.state, store.getters)(hotId)
  let filteredNames = _.without(names, undefined, null, '')
  return filteredNames
}

export function hasAllColumnTypes (hotId, columnProperties) {
  let types = store.getters.getAllHotColumnTypesFromHotId(store.state, store.getters)(hotId)
  return hasAllValidColumnProperty(types, columnProperties)
}

function hasAllValidColumnProperty (values, columnProperties) {
  let validValues = _.without(values, undefined, null, '')
  return validValues.length === columnProperties.length
}

export function isCaseSensitive (hotId) {
  const tableProperties = store.state.hotTabs[hotId].tableProperties
  let caseSensitiveHeader = DEFAULT_DIALECT.caseSensitiveHeader
  if (typeof tableProperties !== 'undefined' && typeof tableProperties.dialect !== 'undefined' && tableProperties.dialect.caseSensitiveHeader) {
    caseSensitiveHeader = tableProperties.dialect.caseSensitiveHeader
  }
  return caseSensitiveHeader
}
