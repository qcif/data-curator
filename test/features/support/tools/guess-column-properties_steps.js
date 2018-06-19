import { expect, should, assert } from 'chai'
import { Given, When, Then } from 'cucumber'

When(/^the Guess Column Properties command is invoked$/, function () {
  return this.app.client.waitForVisible('#toolbar')
    .element('#guess-column-properties')
    .click()
})
