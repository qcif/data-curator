import store from '@/store'
import _ from 'lodash'
import os from 'os'

const _errorsTitle = `#### Known Data Errors`
const _errorsPreText = `
This data is published with the following data errors:

`

export function compileAndStringifyProvenance() {
  const mainText = store.getters.getProvenance.markdown
  const allHotErrors = store.getters.getProvenance.hotErrors
  let stringified = ''
  _.forEach(allHotErrors, function(errors, hotId) {
    let hotErrors = compileHotErrors(errors, hotId)
    stringified += `${hotErrors}\n`
  })
  return `${mainText}${os.EOL}${stringified}`
}

export function compileHotErrors(errors, hotId) {
  const tabTitle = getTabTitleFromHotId(hotId)
  return compileErrors(errors, tabTitle)
}

export function stringifyProvenance(mainText, allHotErrors) {
  let stringified = ''
  _.forEach(allHotErrors, function(errors, hotId) {
    stringified += `${errors}\n`
  })
  return `${mainText}${os.EOL}${stringified}`
}

function getTabTitleFromHotId(hotId) {
  const tabId = store.getters.getTabIdFromHotId(hotId)
  return store.getters.tabTitle(tabId)
}

function compileErrors(errors, tabTitle) {
  let compiled = _.template(`${_errorsTitle} - ${tabTitle}${_errorsPreText}<%= errorsList %>`)
  return compiled({ 'errorsList': errorsListToString(errors) })
}

function errorsListToString(errors) {
  return _.map(errors, function(error) {
    return `${error.message}`
  }).join(os.EOL)
}
