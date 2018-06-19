import { expect, should, assert } from 'chai'
import { Given, When, Then } from 'cucumber'
import _ from 'lodash'

export function mapArrayToInteger(array, i) {
  _.map(array, function(element) {
    if (!_.isInteger(element)) {
      element = i
    }
  })
}
