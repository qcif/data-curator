import { expect, should, assert } from 'chai'
import { Given, When, Then } from 'cucumber'

When(/^the Guess Column Properties command is invoked$/, function () {
  return this.app.client.waitForVisible('#toolbar')
    .element('#guess-column-properties')
    .click()
})

Then(/^the success message should be displayed$/, function () {
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#other-message')
    .then(function(text) {
      expect(text).to.equal('Success: Guess column properties succeeded.')
    })
})

Then(/^the failure message should be displayed$/, function () {
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#other-message')
    .then(function(text) {
      expect(text).to.match(/^Failed: Guess column properties failed.*$/)
    })
})
Then(/^a message to set column names should be displayed$/, function () {
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#other-message')
    .then(function(text) {
      expect(text).to.match(/^.*Column names must be set.$/)
    })
})
