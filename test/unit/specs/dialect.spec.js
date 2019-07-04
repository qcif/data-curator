import { pushCsvDialect, pushCsvFormat } from '@/dialect'
import store from '@/store'
import { resetStateObject } from '@/store/modules/hots.js'
import { fileFormats } from '@/file-formats'
import { DEFAULT_DIALECT } from 'datapackage/lib/config.js'
import _ from 'lodash'
import { registerHot, stubHotInDocumentDom } from '../helpers/hotHelper'
import * as dataActions from '@/data-actions.js'

describe('Push Csv dialect and formats', function () {
  let sandbox
  let guid = 'ht1234'
  beforeEach(function () {
    sandbox = sinon.createSandbox()
    // ensure any leftover state from other tests cleaned up
    store.commit('resetHotState')
  })

  afterEach(function () {
    sandbox.restore()
    store.commit('resetHotState')
  })

  it(`persists dialect keys and values to hot's table properties`, function () {
    pushCsvDialect(guid, { caseSensitiveHeader: true, foo: 'bar' })
    expect(store.getters.getHotTabs).to.deep.equal({ ht1234: { tableProperties: { dialect: { caseSensitiveHeader: true, foo: 'bar' } } } })
  })

  it(`persists mediatype to hot's table properties`, function () {
    pushCsvFormat(guid, { mediatype: 'text/csv' })
    expect(store.getters.getHotTabs).to.deep.equal({ ht1234: { tableProperties: { mediatype: 'text/csv' } } })
  })

  it(`persists file format to hot's table properties`, function () {
    pushCsvFormat(guid, { format: 'csv' })
    expect(store.getters.getHotTabs).to.deep.equal({ ht1234: { tableProperties: { format: 'csv' } } })
  })

  it(`persists csv default file format correctly to hot's table properties`, function () {
    pushCsvFormat(guid, fileFormats.csv)
    expect(store.getters.getHotTabs).to.deep.equal({ ht1234: { tableProperties: { dialect: DEFAULT_DIALECT, mediatype: 'text/csv', format: 'csv' } } })
  })

  it(`persists tsv default file format correctly to hot's table properties`, function () {
    const tsvDialect = _.assign({}, DEFAULT_DIALECT, {
      delimiter: '\t'
    })
    pushCsvFormat(guid, fileFormats.tsv)
    expect(store.getters.getHotTabs).to.deep.equal({ ht1234: { tableProperties: { dialect: tsvDialect, mediatype: 'text/tab-separated-values', format: 'tsv' } } })
  })

  it(`persists ssv default file format correctly to hot's table properties`, function () {
    const ssvDialect = _.assign({}, DEFAULT_DIALECT, {
      delimiter: ';'
    })
    pushCsvFormat(guid, fileFormats.semicolon)
    expect(store.getters.getHotTabs).to.deep.equal({ ht1234: { tableProperties: { dialect: ssvDialect, mediatype: 'text/csv', format: 'csv' } } })
  })

  it(`persists format correctly into hot's table properties, when loading data with csv format`, function () {
    stubHotInDocumentDom(sandbox)
    const hot = registerHot()
    const data = '1,2,3\r\n4,5,6'
    dataActions.loadDataIntoHot(hot, data, fileFormats.csv)
    const expected = {}
    expect(store.getters.getHotTabs[hot.guid].tableProperties).to.deep.equal({ dialect: DEFAULT_DIALECT, mediatype: 'text/csv', format: 'csv' })
  })

  it(`persists format correctly into hot's table properties, when loading data with a custom format`, function () {
    const customFormat = {
      dialect: {
        delimiter: '|',
        doubleQuote: true,
        lineTerminator: '\t',
        quoteChar: ':',
        skipInitialSpace: false,
        header: true,
        caseSensitiveHeader: false
      },
      mediatype: 'text/foo',
      format: 'bar'
    }
    stubHotInDocumentDom(sandbox)
    const hot = registerHot()
    const data = '1,2,3\r\n4,5,6'
    dataActions.loadDataIntoHot(hot, data, customFormat)
    expect(store.getters.getHotTabs[hot.guid].tableProperties).to.deep.equal(customFormat)
  })

  it(`ONLY persists format attributes 'dialect', 'mediatype' and 'format' into hot's table properties, when loading data with a format`, function () {
    const customFormat = {
      dialect: {
        delimiter: '|',
        doubleQuote: true,
        lineTerminator: '\t',
        quoteChar: ':',
        skipInitialSpace: false,
        header: true,
        caseSensitiveHeader: false,
        customAttribute: '\r\r\n'
      },
      mediatype: 'text/foo',
      format: 'bar',
      unsupportedAttribute: '!!'
    }
    stubHotInDocumentDom(sandbox)
    const hot = registerHot()
    const data = '1,2,3\r\n4,5,6'
    const expected = _.assign({}, customFormat)
    _.unset(expected, 'unsupportedAttribute')
    dataActions.loadDataIntoHot(hot, data, customFormat)
    expect(store.getters.getHotTabs[hot.guid].tableProperties).to.deep.equal(expected)
  })
})
