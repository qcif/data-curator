import { resetHotStore } from '../helpers/storeHelper.js'
import { stubHotInDocumentDom, resetHot, registerHot } from '../helpers/basicHotHelper.js'
import { globalBefore, globalStubTab, restoreRemoteGetGlobal } from '../helpers/globalHelper.js'
import { saveDataToFile, loadDataIntoHot } from '@/data-actions'
import { fileFormats } from '@/file-formats'
import fs from 'fs-extra'
import os from 'os'
// sinonTest doesn't seem to work with complex callbacks
// const sinonTest = require('sinon-test')(sinon, {useFakeTimers: false})

describe('file actions', () => {
  // let globalStub
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

  describe('opening csv data', () => {
    it('opens simple csv data capturing it in a handsontable', () => {
      let data = `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function() {
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

  describe('opening semicolon-separated data', () => {
    it('opens simple semicolon-separated data capturing it in a handsontable', () => {
      let data = `foo;bar;baz${os.EOL}1;2;3${os.EOL}4;5;6`
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function() {
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

  describe('saving csv data into a file', () => {
    it('saves simple csv data to a file, with data intact, using dialect.lineTerminator', function(done) {
      let data = `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`
      let expectedData = `foo,bar,baz\r\n1,2,3\r\n4,5,6\r\n`
      let tempFile = `${os.tmpdir()}/mycsv.csv`
      globalStubTab()
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function() {
        saveDataToFile(hot, fileFormats.csv, tempFile, function() {
          fs.readFile(tempFile, 'utf-8', function(err, d) {
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
              // TODO : title is now in tab - test this.
            }
          })
        })
      })
      loadDataIntoHot(hot, data)
    })
  })

  describe('convert file', () => {
    it('converts a file from csv to tsv, using dialect.lineTerminator', function(done) {
      let data = `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`
      let tempFile = `${os.tmpdir()}/mytsv.tsv`
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', () => {
        saveDataToFile(hot, fileFormats.tsv, tempFile, () => {
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
