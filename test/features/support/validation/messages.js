import { expect } from 'chai'
import { Then } from 'cucumber'
import { expectFailureMessageWithText, expectSuccessMessageWithText, validationMessages } from '../page-objects/messages.js'
import { errorColor } from '../page-objects/style.js'
import { mapArrayToInteger } from '../page-objects/helpers.js'
import _ from 'lodash'
import { activeTableElement, rowSelector } from '../page-objects/selectors'

Then(/^the success message should be displayed with message "([\w ]+?)"$/, async function (message) {
  await expectSuccessMessageWithText(this.app, message)
})

Then(/^the failure message should be displayed with message "([\w ]+?)"$/, async function (message) {
  await expectFailureMessageWithText(this.app, message)
})

Then(/^the validation failure message should be displayed with the message(?:s|): "(.+?)" for rows: "(.*?)" and columns: "(.*?)"$/, async function (stringified, r, c) {
  const keys = JSON.parse(stringified)
  expect(_.isArray(keys)).to.equal(true)
  const rows = JSON.parse(r)
  expect(_.isArray(rows)).to.equal(true)
  const cols = JSON.parse(c)
  expect(_.isArray(cols)).to.equal(true)
  const messagePanel = await this.app.client.$('#message-panel')
  await (await messagePanel.$('#error-messages0')).waitForDisplayed({ timeout: this.pageTimeout })
  const messageText = await messagePanel.getHTML(false)

  const messageTitle = await messagePanel.$('.message-title')
  const messageTitleText = await messageTitle.getHTML(false)
  expect(messageTitleText).to.match(/Validation Errors/)

  const messageContent = await messagePanel.$('.errors-content')
  const subMessageContent = await messageContent.$$('[id^="error-messages"]')
  const actualTextErrorMessages = []
  // collect in 3s: (row, column, message)
  for (const errorMessage of subMessageContent) {
    const errorMessageParts = await (await messageContent.$(errorMessage)).$$('span')
    const errorMessageText = []
    for (const errorMessagePart of errorMessageParts) {
      const nextText = await (await messageContent.$(errorMessagePart)).getText()
      errorMessageText.push(nextText)
    }
    actualTextErrorMessages.push(errorMessageText)
  }
  expect(actualTextErrorMessages.length).to.equal(keys.length)
  for (const [index, key] of keys.entries()) {
    const actualRow = actualTextErrorMessages[index].shift()
    const expectedRow = rows[index]
    if (expectedRow) {
      let expectedRowRegex = new RegExp('^\\(row:' + expectedRow + '\\)')
      expect(actualRow).to.match(expectedRowRegex)
    } else {
      expect(_.isEmpty(actualRow)).to.equal(true)
    }
    const actualColumn = actualTextErrorMessages[index].shift()
    const expectedCol = cols[index]
    if (expectedCol) {
      let expectedColRegex = new RegExp('^\\(row:.*\\)\\(col:' + expectedCol + '\\)')
      expect(actualColumn).to.match(expectedColRegex)
    } else {
      expect(_.isEmpty(actualColumn)).to.equal(true)
    }
    const actualErrorMessage = actualTextErrorMessages[index].shift()
    let expectedMessageRegex = validationMessages[key]
    expect(actualErrorMessage).to.match(expectedMessageRegex)
  }
})

Then(/^the table cell errors should be highlighted for rows: "(.*?)" and columns: "(.*?)"$/, async function (r, c) {
  const rows = JSON.parse(r)
  expect(_.isArray(rows)).to.equal(true)
  const cols = JSON.parse(c)
  expect(_.isArray(cols)).to.equal(true)
  expect(cols.length).to.be.at.most(rows.length)
  cols.push(...(Array(rows.length - cols.length).fill(0)))
  mapArrayToInteger(rows, 0)
  mapArrayToInteger(cols, 0)
  const activeTable = await activeTableElement(this.app)
  const actualRows = await activeTable.$$(rowSelector)
  for (const [index, row] of rows.entries()) {
    const actualRowCells = await (await activeTable.$(actualRows[row])).$$('td')
    const actualCellWithColor = await activeTable.$(actualRowCells[cols[index]])
    const actualCellColor = await actualCellWithColor.getCSSProperty('backgroundColor')
    expect(actualCellColor.value).to.equal(errorColor)
  }
})

Then(/^the validation errors count should be "(\d+)"$/, async function (errorsCount) {
  const messagePanel = await this.app.client.$('#message-panel')
  await messagePanel.waitForDisplayed({ timout: this.pageTimeout })
  const messageText = await messagePanel.getHTML(false)
  const errorCountMessage = await messagePanel.$('.errors-meta .navbar-text')
  const errorCountMessageText = await errorCountMessage.getHTML(false)
  let regexp = new RegExp(`${errorsCount} Error\\(s\\)`)
  expect(errorCountMessageText).to.match(regexp)
})
