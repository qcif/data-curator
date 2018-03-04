import {HotRegister} from '@/hot.js'
import {rows} from '@/ragged-rows'
import {saveDataToFile, loadDataIntoHot} from '@/data-actions'
import {fileFormats} from '@/file-formats'
import {remote} from 'electron'
import fs from 'fs'
import os from 'os'

import sinon from 'sinon'
import chai from 'chai'
sinon.config = {
  useFakeTimers: false
}
let assert = chai.assert
let expect = chai.expect
let should = chai.should()
// const util = require('util')
// const readF = util.promisify(fs.readFile)

describe('file actions', () => {
  let globalStub
  let hotRegisterActiveQueryStub
  let items = {
    tab: {
      activeTitle: '',
      activeFilename: '',
      filenames: []
    }
  }
  let hotElementClassName = 'stubbedHot'

  function resetDocument() {
    document.open()
    document.write('<html><body></body></html>')
    document.close()
  }

  function stubDom() {
    let hotView = document.createElement('div')
    hotView.setAttribute('class', hotElementClassName)
    document.body.appendChild(hotView)
  }

  function stubActiveQuery() {
    return document.querySelectorAll(`.${hotElementClassName}`)[0]
  }

  function stubHotRegisterActiveQuery() {
    hotRegisterActiveQueryStub = sinon.stub(HotRegister, 'activeQuery')
    hotRegisterActiveQueryStub.withArgs().returns(stubActiveQuery())
  }

  before(function() {
    window._ = require('lodash')
  })

  beforeEach(() => {
    resetDocument()
    stubDom()
    stubHotRegisterActiveQuery()
  })

  function registerHot() {
    let container = stubActiveQuery()
    let hotId = HotRegister.register(container)
    let hot = HotRegister.getInstance(hotId)
    return hot
  }

  let globalStubTab = () => {
    globalStub = sinon.stub(remote, 'getGlobal')
    globalStub.withArgs('tab').returns({activeTitle: '', activeFilename: '', filenames: []})
  }

  afterEach(() => {
    HotRegister.destroyAllHots()
    hotRegisterActiveQueryStub.restore()
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
    it('saves simple csv data to a file, with data intact', function(done) {
      let data = `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6${os.EOL}`
      let tempFile = `${os.tmpdir()}/mycsv.csv`
      globalStubTab()
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function() {
        saveDataToFile(hot, fileFormats.csv, tempFile, function() {
          fs.readFile(tempFile, 'utf-8', function(err, d) {
            if (err) {
              done(err)
            } else {
              try {
                expect(d).to.equal(data)
                globalStub.restore()
                done()
              } catch (err) {
                done(err)
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
    it('converts a file from csv to tsv', done => {
      let data = `foo,bar,baz${os.EOL}1,2,3${os.EOL}4,5,6`
      let tempFile = `${os.tmpdir()}/mytsv.tsv`
      globalStubTab()
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', () => {
        saveDataToFile(hot, fileFormats.tsv, tempFile, () => {
          fs.readFile(tempFile, 'utf-8', (err, d) => {
            if (err) {
              done(err)
            }
            try {
              expect(d).to.deep.equal(`foo\tbar\tbaz${os.EOL}1\t2\t3${os.EOL}4\t5\t6${os.EOL}`)
              done()
            } catch (err) {
              done(err)
            }
          })
        })
      })
      loadDataIntoHot(hot, data)
      globalStub.restore()
    })
  })
})
