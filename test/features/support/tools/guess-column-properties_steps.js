import { expect, should, assert } from 'chai'
import { Given, When, Then } from 'cucumber'

When(/^I invoke the Guess Column Properties command$/, function () {
  return this.app.client.waitForVisible('#toolbar')
    .element('#guess-column-properties')
    .click()
})

Then(/^I should see the success message$/, function () {
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#other-message')
    .then(function(text) {
      expect(text).to.equal('Success: Guess column properties succeeded.')
    })
})

Then(/^I should see the failure message$/, function () {
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#other-message')
    .then(function(text) {
      expect(text).to.match(/^Failed: Guess column properties failed.*$/)
    })
})
Then(/^I should a message to set column name$/, function () {
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#other-message')
    .then(function(text) {
      expect(text).to.match(/^.*Column names must be set.$/)
    })
})
