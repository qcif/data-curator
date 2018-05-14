import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
const _ = require('lodash')
const highlightColor = 'rgba(181,209,255,0.3)'
Then(/^the column that cursor is in should be displayed/, function () {
  this.app.client.element(`form#findAndReplace input:first-of-type`).click()
  let found = false
  this.app.client.element('.editor.handsontable')
    .getCssProperty('.ht_master table tr td', 'backgroundColor')
    .then(function(response) {
      _.forEach(response, function(next, key) {
        console.log(next.value)
        console.log(highlightColor)
        if (next.value === highlightColor) {
          console.log('found it')
          found = true
          console.log(found)
        }
      })

      // _.forEach(function(value, index) {
      //   console.log(value)
      // })
      expect(found).to.equal(true)
    })

  // return this.app.client.waitForVisible('.current.highlight')
})

export function waitForVisibleIdFromLabel(parentSelector, label) {
  const camelCase = _.camelCase(label)
  const kebabCase = _.kebabCase(label)
  return
  this.app.client.waitForVisible('${parentSelector} #${kebabCase}') ||
  this.app.client.waitForVisible('${parentSelector} #${camelCase}')
}
