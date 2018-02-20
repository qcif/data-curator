const { Given, When, Then} = require('cucumber')
const { expect, should, assert } = require('chai')
var fakeDialog = require('spectron-fake-dialog')
var Application = require('spectron').Application
var electron = require('electron')

Given(/^I have opened Data Curator$/, function () {
  this.app = new Application({
    path: electron,
    args: ['dist/electron/main.js'],
    startTimeout: 10000,
    waitTimeout: 10000
  })
  fakeDialog.apply(this.app)
  return this.app.start()
    .then(() =>
      // 1 = Quit (No Cancel No save)
      fakeDialog.mock([ { method: 'showMessageBox', value: 1 } ])
    )
})

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
