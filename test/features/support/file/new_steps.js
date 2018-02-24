import { expect, should, assert } from 'chai'
import { Given, When, Then} from 'cucumber'
const _ = require('lodash')

When(/^I have opened Data Curator$/, function () {
  return this
    .app
    .client
    .waitUntilWindowLoaded()
    .getTitle()
    .then(title => {
      expect(title).to.equal('Data Curator')
    })
})

Then(/^I should see 1 window opened$/, function () {
  return this.app.client.waitUntilWindowLoaded()
    .getWindowCount()
    .then(count => {
      expect(count).to.equal(1)
    })
})

Then(/^The window should have 1 tab opened$/, function () {
  return this.app.client
    .waitForVisible('#csvEditor')
    .elements('.tab-header')
    .then(response => {
      expect(response.value.length).to.equal(1)
    })
})

Then(/^The tab should have 1 table$/, function () {
  return this.app.client
    .waitForVisible('#csvEditor')
    .elements('.tab-content')
    .then(response => {
      expect(response.value.length).to.equal(1)
    })
    .elements('.editor.handsontable')
    .then(response => {
      expect(response.value.length).to.equal(1)
    })
})

Then(/^The table (?:should have|has) (\d+) row[s]? by (\d+) column[s]?$/, function (rowCount, colCount) {
  return this.app.client.element('.editor.handsontable')
    .elements('.ht_master table tr th')
    .then(response => {
      expect(response.value.length).to.deep.equal(rowCount)
    })
    .element('.ht_master table tr')
    .elements('td')
    .then(response => {
      expect(response.value.length).to.deep.equal(colCount)
    })
})

Then(/^The table should be empty$/, function () {
  return this.app.client.element('.editor.handsontable')
    .getText('.ht_master table tr td')
    .then(array => {
      let text = array.join('')
      expect(text).to.equal('')
    })
})

Then(/^The cursor should be in row (\d+), column (\d+)$/, function (rowNumber, colNumber) {
  return this.app.client.element('.editor.handsontable')
    .getAttribute('.ht_master table tr th', 'class')
    .then(response => {
      const selectedRowHeaderClass = 'ht__highlight'
      // when only 1 value returned no longer an array
      if (_.isArray(response)) {
        expect(response[rowNumber - 1]).to.equal(selectedRowHeaderClass)
      } else if (rowNumber === 1) {
        expect(response).to.equal(selectedRowHeaderClass)
      } else {
        throw new Error(`There is only 1 row in the table, but the test tried to look for row number: ${rowNumber}`)
      }
    })
    .getAttribute('.ht_master table tr td', 'class')
    .then(response => {
      const selectedCellClass = 'current highlight'
      // when only 1 value returned no longer an array
      if (_.isArray(response)) {
        expect(response[colNumber - 1]).to.equal(selectedCellClass)
      } else if (colNumber === 1) {
        expect(response).to.equal(selectedCellClass)
      } else {
        throw new Error(`There is only 1 column in the table, but the test tried to look for column number: ${colNumber}`)
      }
    })
})
