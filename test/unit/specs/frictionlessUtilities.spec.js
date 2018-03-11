import {isCaseSensitive} from '@/frictionlessUtilities'
import store from '@/store/modules/hots'

import {resetHotStore} from '../helpers/storeHelper.js'
import {stubHotInDocumentDom, resetHot, registerHot} from '../helpers/basicHotHelper.js'
import {globalBefore} from '../helpers/globalHelper.js'

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
    [
      {hotTab: {}, expected: false},
      {hotTab: {tableProperties: {}}, expected: false},
      {hotTab: {tableProperties: {dialect: {}}}, expected: false},
      {hotTab: {tableProperties: {dialect: {caseSensitiveHeader: false}}}, expected: false},
      {hotTab: {tableProperties: {dialect: {caseSensitiveHeader: true}}}, expected: true}
    ].forEach(function(test) {
      it(`returns false when table properties is ${JSON.stringify(test.hotTabs)}`, sinonTest(function() {
        let hot = registerHot()
        store.state.hotTabs[hot.guid] = test.hotTab
        expect(isCaseSensitive(hot.guid)).to.equal(test.expected)
      }))
    })
  })
})
