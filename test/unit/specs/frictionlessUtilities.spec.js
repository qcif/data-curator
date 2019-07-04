import * as sut from '@/frictionlessUtilities'
import store from '@/store/modules/hots'
import { stubHotInDocumentDom, resetHot, registerHot } from '../helpers/hotHelper.js'
import { globalBefore } from '../helpers/globalHelper.js'
import { loadDataIntoHot } from '@/data-actions'
import os from 'os'

describe('frictionless utilities', function () {
  before(function () {
    globalBefore()
  })
  let sandbox
  beforeEach(function () {
    sandbox = sinon.createSandbox()
    stubHotInDocumentDom(sandbox)
  })
  afterEach(function () {
    resetHot(sandbox)
    sandbox.restore()
  })
  describe('is case sensitive', function () {
    [ { hotTab: {}, expected: false },
      { hotTab: { tableProperties: {} }, expected: false },
      { hotTab: { tableProperties: { dialect: {} } }, expected: false },
      { hotTab: { tableProperties: { dialect: { caseSensitiveHeader: false } } }, expected: false },
      { hotTab: { tableProperties: { dialect: { caseSensitiveHeader: true } } }, expected: true }
    ].forEach(test => {
      it(`when table properties is ${JSON.stringify(test.hotTab)}`, function () {
        let hot = registerHot()
        store.state.hotTabs[hot.guid] = test.hotTab
        expect(sut.isCaseSensitive(hot.guid)).to.equal(test.expected)
      })
    })
  })

  describe('include headers in data', function () {
    [
      { data: `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`,
        hasHeaders: false,
        expected: [
          ['1', '2', '3'],
          ['4', '5', '6']
        ]
      },
      { data: `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`,
        hasHeaders: true,
        expected: [
          ['foo', 'bar', 'baz'],
          ['1', '2', '3'],
          ['4', '5', '6']
        ]
      }
    ].forEach(test => {
      it(`asserts that hot has headers after data is first loaded`, function () {
        let hot = registerHot()
        loadDataIntoHot(hot, test.data)
        expect(hot.hasColHeaders()).to.equal(true)
      })
      it(`returns data when hasHeaders is ${test.hasHeaders}`, function () {
        let hot = registerHot()
        loadDataIntoHot(hot, test.data)
        sandbox.stub(hot, 'hasColHeaders').returns(test.hasHeaders)
        let result = sut.includeHeadersInData(hot)
        expect(result).to.deep.equal(test.expected)
      })
    })
  })
})
