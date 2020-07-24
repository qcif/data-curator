import store from '@/store/modules/hots.js'
import { DEFAULT_DIALECT } from 'datapackage/lib/config.js'
import { TableSchemaError } from 'datapackage'
import _ from 'lodash'

const errorMatchMappings = [
  {
    errorClass: TableSchemaError,
    messagePatterns: [/Tabular format.*tsv.*is not supported/gi]
  }
]

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

export function handleFrictionlessError (error) {
  if (!isErrorWhitelisted(error)) {
    throw error
  } else {
    console.warn('Recovered from frictionless library problem.', error)
  }
}

export function isErrorWhitelisted (error) {
  let isWhiteListed = false
  let extraErrorMessage = extractMessageFromFrictionlessError(error)
  if (!_.isEmpty(extraErrorMessage)) {
    _.each(errorMatchMappings, function (next) {
      if (error instanceof next.errorClass) {
        for (const messagePattern of next.messagePatterns) {
          let indexFound = extraErrorMessage.search(messagePattern)
          if (indexFound > -1) {
            isWhiteListed = true
            break
          }
        }
      }
    })
  }
  return isWhiteListed
}

export function addErrorCauseToMessage (error, errorMessage) {
  let errorCauseMessage = extractMessageFromFrictionlessError(error)
  return addExtraToErrorMessage(errorCauseMessage, errorMessage)
}

export function extractMessageFromFrictionlessError (error) {
  let errorMessage = _.trim(_.get(error, 'message', ''))
  if (_.isEmpty(errorMessage)) {
    if (_.isArray(error) && !_.isEmpty(error)) {
      errorMessage = _.trim(_.get(error[0], 'message', ''))
    }
  }
  return errorMessage
}

export function addExtraToErrorMessage (extraMessage, errorMessage) {
  if (!_.isEmpty(_.trim(extraMessage))) {
    errorMessage = `${errorMessage}\n (${extraMessage})`
  }
  return errorMessage
}
