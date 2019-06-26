import _ from 'lodash'
import { mockShell } from './mockMainProcess'

export function mapArrayToInteger(array, i) {
  _.map(array, function(element) {
    if (!_.isInteger(element)) {
      element = i
    }
  })
}

export function sendOpenUrlCall(url) {
  return mockShell([{ method: 'openExternal', value: url }])
}
