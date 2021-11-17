import { expect } from 'chai'
import { Then } from 'cucumber'
import { validationMessages } from '../page-objects/messages.js'
import { errorColor } from '../page-objects/style.js'
import { mapArrayToInteger } from '../page-objects/helpers.js'
import _ from 'lodash'
import { activeTableElement, rowSelector } from '../page-objects/selectors'

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

Then(/^the validation failure message should be displayed with the message(?:s|): "(.+?)" for rows: "(.*?)" and columns: "(.*?)"$/, async function (stringified, r, c) {
  const keys = JSON.parse(stringified)
  expect(_.isArray(keys)).to.equal(true)
  console.log(`keys are ${keys}`)
  const rows = JSON.parse(r)
  expect(_.isArray(rows)).to.equal(true)
  console.log(`rows are ${rows}`)
  const cols = JSON.parse(c)
  expect(_.isArray(cols)).to.equal(true)
  console.log(`cols are ${cols}`)
  const messagePanel = await this.app.client.$('#message-panel')
  await messagePanel.waitForDisplayed({ timout: this.pageTimeout })
  const messageText = await messagePanel.getHTML(false)
  console.log(`message text is ${messageText}`)

  const messageTitle = await messagePanel.$('.message-title')
  const messageTitleText = await messageTitle.getHTML(false)
  console.log(`message title is ${messageTitleText}`)
  expect(messageTitleText).to.match(/Validation Errors/)

  const messageContent = await messagePanel.$('.errors-content')
  const subMessageContent = await messageContent.$$('span')
  const actualText = []
  for (const spanTag of subMessageContent) {
    const nextText = await (await messageContent.$(spanTag)).getText()
    console.log(`sub text is ${nextText}`)
    if (nextText) {
      actualText.push(nextText)
    }
  }
  for (const [index, key] of keys.entries()) {
    console.log(`next index is ${index}`)
    console.log(`next key is .${key}.`)
    const actualErrorMessage = actualText[index]
    const expectedRow = rows[index]
    const expectedCol = cols[index]
    let expectedMessageRegex = validationMessages[key]
    console.log(`expected message: ${expectedMessageRegex}`)
    console.log(`actualErrorMessage: ${actualErrorMessage}`)
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
  const activeTable = await activeTableElement(this.app)
  const actualRows = await activeTable.$$(rowSelector)
  for (const [index, row] of rows.entries()) {
    console.log('inside row entries...')
    const actualRowCells = await (await activeTable.$(actualRows[row])).$$('td')
    const actualCellWithColor = await activeTable.$(actualRowCells[cols[index]])
    const actualCellColor = await actualCellWithColor.getCSSProperty('backgroundColor')
    expect(actualCellColor.value).to.equal(errorColor)
  }
})

Then(/^a message to set column names should be displayed$/, function () {
  return this.app.client.waitForVisible('#message-panel', 1000)
    .getText('#other-message')
    .then(function (text) {
      expect(text).to.match(/^.*Column names must be set.$/)
    })
})

Then(/^the validation errors count should be "(\d+)"$/, async function (errorsCount) {
  const messagePanel = await this.app.client.$('#message-panel')
  await messagePanel.waitForDisplayed({ timout: this.pageTimeout })
  const messageText = await messagePanel.getHTML(false)
  console.log(`message text is ${messageText}`)
  const errorCountMessage = await messagePanel.$('.errors-meta .navbar-text')
  const errorCountMessageText = await errorCountMessage.getHTML(false)
  console.log(`message errorCountMessageText is ${errorCountMessageText}`)
  let regexp = new RegExp(`${errorsCount} Error\\(s\\)`)
  expect(errorCountMessageText).to.match(regexp)
})
