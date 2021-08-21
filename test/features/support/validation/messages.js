import { expect } from 'chai'
import { Then } from 'cucumber'
import { validationMessages } from '../page-objects/messages.js'
import { errorColor } from '../page-objects/style.js'
import { mapArrayToInteger } from '../page-objects/helpers.js'
import _ from 'lodash'

Then(/^the success message should be displayed with message "([\w ]+?)"$/, function (message) {
  let regexp = new RegExp('^.*Success: ' + message + '.*$', 'm')
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#other-message')
    .then(function (text) {
      expect(text).to.equal(regexp)
    })
})

Then(/^the failure message should be displayed with message "([\w ]+?)"$/, function (message) {
  let regexp = new RegExp('^.*Failed: ' + '.*$', 'm')
  return this.app.client.waitForText('#message-panel', this.pageTimeout)
    .getText('#message-panel')
    .then(function (text) {
      expect(text).to.match(regexp)
    })
})

Then(/^the validation failure message should be displayed with the message(?:s|) "(.+?)"$/, function (stringified) {
  const keys = JSON.parse(stringified)
  expect(_.isArray(keys)).to.equal(true)
  const messages = keys.map(function (key) {
    return _.escapeRegExp(validationMessages[key])
  }).join('[\\s]')
  let regexp = new RegExp('^.*Validation Errors[\\s].*[\\s]' + messages + '.*$', 'm')
  return this.app.client.waitForText('#message-panel', this.pageTimeout)
    .getText('#message-panel')
    .then(function (text) {
      expect(text).to.match(regexp)
    })
})

Then(/^the validation failure message should be displayed with the message(?:s|): "(.+?)" for rows: "(.*?)" and columns: "(.*?)"$/, function (stringified, r, c) {
  const keys = JSON.parse(stringified)
  expect(_.isArray(keys)).to.equal(true)
  const rows = JSON.parse(r)
  expect(_.isArray(rows)).to.equal(true)
  const cols = JSON.parse(c)
  expect(_.isArray(cols)).to.equal(true)
  return this.app.client.waitForText('#message-panel', this.pageTimeout)
    .getText('#message-panel')
    .then(function (text) {
      let actualText = text.split('\n')
      expect(actualText.shift()).to.match(/Validation Errors/)
      // ignore error count
      actualText.shift()
      for (const [index, key] of keys.entries()) {
        const actualErrorMessage = actualText[index]
        const expectedRow = rows[index]
        const expectedCol = cols[index]
        let expectedMessageRegex = new RegExp(validationMessages[key])
        expect(actualErrorMessage).to.match(expectedMessageRegex)
        if (expectedRow) {
          let expectedRowRegex = new RegExp('^\\(row:' + expectedRow + '\\)')
          expect(actualErrorMessage).to.match(expectedRowRegex)
        }
        if (expectedCol) {
          let expectedColRegex = new RegExp('^\\(row:.*\\)\\(col:' + expectedCol + '\\)')
          expect(actualErrorMessage).to.match(expectedColRegex)
        }
      }
    })
})

Then(/^the table cell errors should be highlighted for rows: "(.*?)" and columns: "(.*?)"$/, async function (r, c) {
  const rows = JSON.parse(r)
  expect(_.isArray(rows)).to.equal(true)
  const cols = JSON.parse(c)
  expect(_.isArray(cols)).to.equal(true)
  // console.log(`rows are`, rows)
  // console.log(`cols are`, cols)
  expect(cols.length).to.be.at.most(rows.length)
  cols.push(...(Array(rows.length - cols.length).fill(0)))
  mapArrayToInteger(rows, 0)
  mapArrayToInteger(cols, 0)
  // console.log(`rows are`, rows)
  // console.log(`cols are`, cols)
  const parentSelector = '.tab-pane.active .editor.handsontable'
  const actualRows = await this.app.client
    .element(parentSelector)
    .elements('.ht_master table tr')
  for (const [index, row] of rows.entries()) {
    let actualRow = await this.app.client.elementIdElements(actualRows.value[row].ELEMENT, 'td')
    let actualColor = await this.app.client.elementIdCssProperty(actualRow.value[cols[index]].ELEMENT, 'backgroundColor')
    expect(actualColor.value).to.equal(errorColor)
  }
})

Then(/^a message to set column names should be displayed$/, function () {
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#other-message')
    .then(function (text) {
      expect(text).to.match(/^.*Column names must be set.$/)
    })
})

Then(/^the validation errors count should be "(\d+)"$/, function (errorsCount) {
  let regexp = new RegExp(errorsCount + ' Error\\(s\\)')
  return this.app.client.waitForText('#message-panel', this.pageTimeout)
    .getText('#message-panel')
    .then(function (text) {
      // console.log(`text is`, text)
      let validations = text.split('\n')
      // console.log('split is', validations)
      expect(validations[1]).to.match(regexp)
    })
})
