import _ from 'lodash'

export function mapArrayToInteger(array, i) {
  _.map(array, function(element) {
    if (!_.isInteger(element)) {
      element = i
    }
  })
}
