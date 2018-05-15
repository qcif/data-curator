import { expect, should, assert } from 'chai'
import { Given, When, Then } from 'cucumber'
const _ = require('lodash')

When(/^Data Curator is open$/, function () {
  return
  this
    .app
    .client
    .waitUntilWindowLoaded()
    .getTitle()
    .then(function(title) {
      expect(title).to.equal('Data Curator')
    })
})

Then(/^1 window should be displayed/, function () {
  return this.app.client.waitUntilWindowLoaded()
    .getWindowCount()
    .then(function(count) {
      expect(count).to.equal(1)
    })
})

Then(/^the window should have (\d+) tab[s]?$/, function (numberOfTabs) {
  return this.app.client
    .waitForVisible('#csvEditor')
    .elements('.tab-header')
    .then(function(response) {
      expect(response.value.length).to.equal(numberOfTabs)
    })
})

Then(/^the (?:new )tab should be in the right-most position$/, function () {
  return this.app.client
    .waitForVisible('#csvEditor')
    // .elements('.tab-header')
    .getAttribute('.tab-header', 'class')
    .then(function(response) {
      console.log(response)
      // const selectedRowHeaderClass = 'ht__highlight'
      // expect(response.value.length).to.equal(numberOfTabs)
      // expect(response).to.contain(selectedRowHeaderClass)
    })
})

Then(/^the (?:new )tab should have 1 table$/, function () {
  return this.app.client
    .waitForVisible('#csvEditor')
    .elements('.tab-content')
    .then(function(response) {
      expect(response.value.length).to.equal(1)
    })
    .elements('.active .editor.handsontable')
    .then(function(response) {
      expect(response.value.length).to.equal(1)
    })
})

Then(/^the (?:new )table (?:should have|has) (\d+) row[s]? by (\d+) column[s]?$/, function (rowCount, colCount) {
  return this.app.client.element('.active .editor.handsontable')
    .elements('.ht_master table tr th')
    .then(function(response) {
      expect(response.value.length).to.deep.equal(rowCount)
    })
    .element('.ht_master table tr')
    .elements('td')
    .then(function(response) {
      expect(response.value.length).to.deep.equal(colCount)
    })
})

Then(/^the (?:new )table should be empty$/, function () {
  return this.app.client.element('.active .editor.handsontable')
    .getText('.ht_master table tr td')
    .then(function(array) {
      let text = array.join('')
      expect(text).to.equal('')
    })
})

Then(/^the cursor should be in the (?:new )table$/, function () {
  return this.app.client.element('.active .editor.handsontable')
    .getAttribute('.ht_master table tr th', 'class')
    .then(function(response) {
      const selectedRowHeaderClass = 'ht__highlight'
      expect(response).to.contain(selectedRowHeaderClass)
    })
})

Then(/^the cursor should be in row (\d+), column (\d+)$/, function (rowNumber, colNumber) {
  return this.app.client.element('.active .editor.handsontable')
    .getAttribute('.ht_master table tr th', 'class')
    .then(function(response) {
      const selectedRowHeaderClass = 'ht__highlight'
      // when only 1 value returned no longer an array
      if (_.isArray(response)) {
        expect(response[rowNumber - 1]).to.contain(selectedRowHeaderClass)
      } else if (rowNumber === 1) {
        expect(response).to.contain(selectedRowHeaderClass)
      } else {
        throw new Error(`There is only 1 row in the table, but the test tried to look for row number: ${rowNumber}`)
      }
    })
    .getAttribute(`.ht_master table tr:nth-child(${rowNumber}) td`, 'class')
    .then(function(response) {
      const selectedCellClass = 'current highlight'
      // when only 1 value returned no longer an array
      if (_.isArray(response)) {
        expect(response[colNumber - 1]).to.contain(selectedCellClass)
      } else if (colNumber === 1) {
        expect(response).to.contain(selectedCellClass)
      } else {
        throw new Error(`There is only 1 column in the table, but the test tried to look for column number: ${colNumber}`)
      }
    })
})
