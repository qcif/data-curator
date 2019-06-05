import { stubHotInDocumentDom, resetHot, registerHot } from '../helpers/hotHelper.js'
import { globalBefore, globalStubTab, restoreRemoteGetGlobal } from '../helpers/globalHelper.js'
import { saveDataToFile, loadDataIntoHot } from '@/data-actions'
import { fileFormats } from '@/file-formats'
import fs from 'fs-extra'
import os from 'os'
import Vuex from 'vuex'
import store from '@/store'
import { stubSimpleTabStore } from '../helpers/storeHelper'
// sinonTest doesn't seem to work with complex callbacks
// const sinonTest = require('sinon-test')(sinon, {useFakeTimers: false})

describe('file actions', function () {
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

  describe('opening csv data', function () {
    it('opens simple csv data capturing it in a handsontable', function () {
      let data = `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function () {
        expect(hot.getColHeader()).to.deep.equal(['foo', 'bar', 'baz'])
        expect(hot.getData()).to.deep.equal([
          [
            '1', '2', '3'
          ],
          ['4', '5', '6']
        ])
      })
      loadDataIntoHot(hot, data)
    })

    it('opens simple csv data, and does not show quotes in handsontable', function () {
      let data = `,,`
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function () {
        expect(hot.getColHeader()).to.deep.equal([])
        expect(hot.getData()).to.deep.equal([
          [
            '', '', ''
          ]
        ])
      })
      loadDataIntoHot(hot, data)
    })

    it('opens simple csv data with quotes, but does not show quotes in handsontable', function () {
      let data = `"","",""`
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function () {
        expect(hot.getColHeader()).to.deep.equal([])
        expect(hot.getData()).to.deep.equal([
          [
            '', '', ''
          ]
        ])
      })
      loadDataIntoHot(hot, data)
    })

    it('opens simple csv data, and does not show quotes in handsontable', function () {
      let data = `"foo","bar","baz"${os.EOL}"1","2","3"${os.EOL}"4","5","6"`
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function () {
        expect(hot.getColHeader()).to.deep.equal(['foo', 'bar', 'baz'])
        expect(hot.getData()).to.deep.equal([
          [
            '1', '2', '3'
          ],
          ['4', '5', '6']
        ])
      })
      loadDataIntoHot(hot, data)
    })
  })

  describe('opening semicolon-separated data', function () {
    it('opens simple semicolon-separated data capturing it in a handsontable', function () {
      let data = `foo;bar;baz${os.EOL}1;2;3${os.EOL}4;5;6`
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function () {
        expect(hot.getColHeader()).to.deep.equal(['foo', 'bar', 'baz'])
        expect(hot.getData()).to.deep.equal([
          [
            '1', '2', '3'
          ],
          ['4', '5', '6']
        ])
      })
      loadDataIntoHot(hot, data, fileFormats.semicolon)
    })
  })

  describe('saving csv data into a file', function () {
    const givenExpectDone = (data, expectedData, done) => {
      givenExpectDoneWithTableData(data, expectedData, ['foo', 'bar', 'baz'], [
        ['1', '2', '3'],
        ['4', '5', '6']
      ], done)
    }
    const givenExpectDoneWithTableData = (data, expectedData, tableHeader, tableData, done) => {
      let tempFile = `${os.tmpdir()}/mycsv.csv`
      globalStubTab(sandbox)
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function () {
        expect(hot.getColHeader()).to.deep.equal(tableHeader)
        expect(hot.getData()).to.deep.equal(tableData)
        saveDataToFile(hot, fileFormats.csv, tempFile, function () {
          fs.readFile(tempFile, 'utf-8', function (err, d) {
            if (err) {
              restoreRemoteGetGlobal()
              fs.removeSync(tempFile)
              done(err)
            } else {
              try {
                expect(d).to.deep.equal(expectedData)
              } catch (err) {
                done(err)
              } finally {
                restoreRemoteGetGlobal()
                fs.removeSync(tempFile)
                done()
              }
            }
          })
        })
      })
      loadDataIntoHot(hot, data)
    }
    it('saves simple csv data to a file, with data intact, using dialect.lineTerminator', function (done) {
      let data = `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`
      let expectedData = `foo,bar,baz\r\n1,2,3\r\n4,5,6\r\n`
      givenExpectDone(data, expectedData, done)
    })
    //
    it('opens simple csv data without quotes and saves, with data intact, without quotes', function (done) {
      let data = `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`
      let expectedData = `foo,bar,baz\r\n1,2,3\r\n4,5,6\r\n`
      givenExpectDone(data, expectedData, done)
    })

    it('opens simple csv data with quotes and saves, with data intact, with quotes', function (done) {
      let data = `"foo","bar","baz"${os.EOL}"1","2","3"${os.EOL}"4","5","6"`
      let expectedData = `"foo","bar","baz"\r\n"1","2","3"\r\n"4","5","6"\r\n`
      givenExpectDone(data, expectedData, done)
    })

    it('opens simple csv data with escaped quotes (`"""`), using the default escape char `"` and default `doublequote` behaviour and saves, with data intact, with escaped quotes', function (done) {
      let data = `"""foo""","""bar""","""baz"""${os.EOL}"""1""","""2""","""3"""${os.EOL}"""4""","""5""","""6"""`
      let expectedData = `"""foo""","""bar""","""baz"""\r\n"""1""","""2""","""3"""\r\n"""4""","""5""","""6"""\r\n`
      givenExpectDoneWithTableData(data, expectedData,
        ['"foo"', '"bar"', '"baz"'],
        [
          ['"1"', '"2"', '"3"'],
          ['"4"', '"5"', '"6"']
        ], done)
    })
  })

  describe('convert file', function () {
    it('converts a file from csv to tsv, using dialect.lineTerminator', function (done) {
      let data = `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`
      let tempFile = `${os.tmpdir()}/mytsv.tsv`
      globalStubTab(sandbox)
      let hot = registerHot()
      let stubbedStore = new Vuex.Store(stubSimpleTabStore(hot))
      let storeStubbedGetters = sandbox.stub(store, 'getters').get(function getterFn () {
        return stubbedStore.getters
      })
      hot.addHook('afterUpdateSettings', function () {
        saveDataToFile(hot, fileFormats.tsv, tempFile, function () {
          let expectedData = `foo\tbar\tbaz\r\n1\t2\t3\r\n4\t5\t6\r\n`
          fs.readFile(tempFile, 'utf-8', (err, d) => {
            if (err) {
              restoreRemoteGetGlobal()
              fs.removeSync(tempFile)
              done(err)
            }
            try {
              expect(d).to.deep.equal(expectedData)
            } catch (err) {
              done(err)
            } finally {
              restoreRemoteGetGlobal()
              fs.removeSync(tempFile)
              done()
            }
          })
        })
      })
      loadDataIntoHot(hot, data)
    })
  })
})
