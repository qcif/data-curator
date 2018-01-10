import {HotRegister} from '@/hot.js'
import {rows} from '@/ragged-rows'
import {saveDataToFile, loadDataIntoHot} from '@/data-actions'
import {fileFormats} from '@/file-formats'
import { mutations } from '@/store'
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
      let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6'
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
      let data = 'foo;bar;baz\r\n1;2;3\r\n4;5;6'
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
    it('saves simple csv data to a file, with data intact', done => {
      let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6\r\n'
      let tempFile = `${os.tmpdir()}/mycsv.csv`
      globalStubTab()
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', function() {
        saveDataToFile(hot, fileFormats.csv, tempFile, () => {
          fs.readFile(tempFile, 'utf-8', (err, d) => {
            console.log('running callback...')
            if (err) {
              console.log(err.stack)
            }
            expect(d).to.deep.equal(data)

            // TODO : title is now in tab - test this.
            done()
          })
        })
      })
      loadDataIntoHot(hot, data)
      globalStub.restore()
    })
  })

  describe('convert file', () => {
    it('converts a file from csv to tsv', done => {
      let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6'
      let tempFile = `${os.tmpdir()}/mytsv.tsv`
      globalStubTab()
      let hot = registerHot()
      hot.addHook('afterUpdateSettings', () => {
        saveDataToFile(hot, fileFormats.tsv, tempFile, () => {
          fs.readFile(tempFile, 'utf-8', (err, d) => {
            if (err) {
              console.log(err.stack)
            }
            expect(d).to.deep.equal('foo\tbar\tbaz\r\n1\t2\t3\r\n4\t5\t6\r\n')
            done()
          })
        })
      })
      loadDataIntoHot(hot, data)
      globalStub.restore()
    })
  })
})
