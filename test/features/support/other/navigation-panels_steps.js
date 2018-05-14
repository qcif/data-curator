import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
const _ = require('lodash')

Then(/^I should see the "([\w ]+?)" panel/, function (panelName) {
  console.log(`panel name is`, panelName)
  return waitForVisibleIdFromLabel(this.app, '#sidenav', panelName)
})

export function waitForVisibleIdFromLabel(app, parentSelector, label) {
  const kebabCase = _.kebabCase(label)
  const camelCase = _.camelCase(label)
  let result
  try {
    result = app.client.waitForVisible('${parentSelector} #${kebabCase}')
    return result
  } catch (error) {
    console.log(`Unable to find via ${kebabCase} Trying ${camelCase}`, error)
    try {
      result = app.client.waitForVisible('${parentSelector} #${camelCase}')
    } catch (error) {
      console.log(`Unable to find via ${camelcase} Aborting`, error)
    } finally {
      return result
    }
  }
}
