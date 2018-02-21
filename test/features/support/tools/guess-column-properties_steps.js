const { Given, When, Then} = require('cucumber')
const { expect, should, assert } = require('chai')

When(/^I invoke the Guess Column Properties command$/, function () {
  return this.app.client.waitForVisible('#toolbar')
    .element('#guess-column-properties')
    .click()
})

Then(/^I should see the success message$/, function () {
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#error-message')
    .then(text => {
      expect(text).to.equal('Success: Guess column properties succeeded.')
    })
})
