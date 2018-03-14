import * as sut from '@/frictionlessUtilities'
import store from '@/store/modules/hots'
import Handsontable from 'handsontable/dist/handsontable.full.js'
import {DEFAULT_DIALECT} from 'datapackage/lib/config.js'

import {resetHotStore} from '../helpers/storeHelper.js'
import {stubHotInDocumentDom, resetHot, registerHot} from '../helpers/basicHotHelper.js'
import {globalBefore} from '../helpers/globalHelper.js'
import {loadDataIntoHot} from '@/data-actions'
import os from 'os'

describe('frictionless utilities', () => {
  before(() => {
    globalBefore()
  })
  beforeEach(() => {
    stubHotInDocumentDom()
  })
  afterEach(() => {
    resetHot()
    resetHotStore()
  })
  describe('is case sensitive', () => {
    [ {hotTab: {}, expected: false},
      {hotTab: {tableProperties: {}}, expected: false},
      {hotTab: {tableProperties: {dialect: {}}}, expected: false},
      {hotTab: {tableProperties: {dialect: {caseSensitiveHeader: false}}}, expected: false},
      {hotTab: {tableProperties: {dialect: {caseSensitiveHeader: true}}}, expected: true}
    ].forEach(function(test) {
      it(`when table properties is ${JSON.stringify(test.hotTabs)}`, sinonTest(function() {
        let hot = registerHot()
        store.state.hotTabs[hot.guid] = test.hotTab
        expect(sut.isCaseSensitive(hot.guid)).to.equal(test.expected)
      }))
      // describe('default dialect', () => {
      //   [ {dialect: false},
      //     {dialect: true}
      //   ].forEach(function(testDialect) {
      //     it(`when table properties is ${JSON.stringify(test.hotTabs)} and DEFAULT is ${dialect}`, sinonTest(function() {
      //       let hot = registerHot()
      //       store.state.hotTabs[hot.guid] = test.hotTab
      //       this.stub(DEFAULT_DIALECT, 'caseSensitiveHeader').value(testDialect)
      //       expect(sut.isCaseSensitive(hot.guid)).to.equal(test.expected)
      //     }))
      //   })
      // })
    })
  })

  describe('include headers in data', () => {
    [
      {data: `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`,
        hasHeaders: false,
        expected: [
          ['1', '2', '3'],
          ['4', '5', '6']
        ]
      },
      {data: `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`,
        hasHeaders: true,
        expected: [
          ['foo', 'bar', 'baz'],
          ['1', '2', '3'],
          ['4', '5', '6']
        ]
      }
    ].forEach(function(test) {
      it(`asserts that hot has headers after data is first loaded`, function() {
        let hot = registerHot()
        loadDataIntoHot(hot, test.data)
        expect(hot.hasColHeaders()).to.equal(true)
      })
      it(`returns data when hasHeaders is ${test.hasHeaders}`, function() {
        let hot = registerHot()
        loadDataIntoHot(hot, test.data)
        sinon.stub(hot, 'hasColHeaders').returns(test.hasHeaders)
        let result = sut.includeHeadersInData(hot)
        expect(result).to.deep.equal(test.expected)
        hot.hasColHeaders.restore()
      })
    })
  })
})
