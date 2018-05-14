import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
const _ = require('lodash')

Then(/^I should see (?:an)? input for (?:a|the) "(find|replace)" value/, function (findOrReplace) {
  return this.app.client.waitForVisible(`#${findOrReplace}`)
})

Then(/^[Tt]he panel's first input box has focus/, function () {
  return this.app.client.hasFocus(`form#findAndReplace input:first-of-type`)
})
