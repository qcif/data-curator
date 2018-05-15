import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
const _ = require('lodash')

Then(/^(?:an)? input for (?:a|the) "(find|replace)" value should be displayed/, function (findOrReplace) {
  return this.app.client.waitForVisible(`#${findOrReplace}`)
})

Then(/^the panel's first input box should have focus/, function () {
  return this.app.client.hasFocus(`form#findAndReplace input:first-of-type`)
})
