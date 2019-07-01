import { When } from 'cucumber'

When(/^the Guess Column Properties command is invoked$/, function () {
  return this.app.client.waitForVisible('#toolbar')
    .element('#guess-column-properties')
    .click()
})
