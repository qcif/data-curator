import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
const _ = require('lodash')

Then(/^I should see the "([\w]+?)([ ][\w]+?)*?" panel/, function (panelName) {
  return waitForVisibleIdFromLabel('#sidenav', panelName)
})

export function waitForVisibleIdFromLabel(parentSelector, label) {
  const camelCase = _.camelCase(label)
  const kebabCase = _.kebabCase(label)
  return
  this.app.client.waitForVisible('${parentSelector} #${kebabCase}') ||
  this.app.client.waitForVisible('${parentSelector} #${camelCase}')
}
