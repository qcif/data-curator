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

let items = {
  tab: {
    activeTitle: '',
    activeFilename: '',
    filenames: []
  }
}

describe('file actions', () => {
  let hot
  let hotId
  let stubGlobal
  before(function() {
    window._ = require('lodash')
  })

  beforeEach(() => {
    let hotView = document.createElement('div')
    document.body.appendChild(hotView)
    hotId = HotRegister.register(hotView)
    hot = HotRegister.getInstance(hotId)
  })

  let stubGlobalTab = () => {
    stubGlobal = sinon.stub(remote, 'getGlobal')
    stubGlobal.withArgs('tab').returns({ activeTitle: '',
      activeFilename: '',
      filenames: []
    })
  }

  afterEach(() => {
    HotRegister.destroyAllHots()
    hot = null
  })

  describe('opening csv data', () => {
    it('opens simple csv data capturing it in a handsontable', () => {
      let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6'
      hot.addHook('afterLoadData', function() {
        expect(hot.getData()).to.eql([
          [
            'foo', 'bar', 'baz'
          ],
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
      hot.addHook('afterLoadData', () => {
        expect(hot.getData()).to.eql([
          [
            'foo', 'bar', 'baz'
          ],
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
      stubGlobalTab()
      hot.addHook('afterLoadData', () => {
        saveDataToFile(hot, fileFormats.csv, tempFile, () => {
          fs.readFile(tempFile, 'utf-8', (err, d) => {
            console.log('running callback...')
            if (err) {
              console.log(err.stack)
            }
            expect(d).to.eq(data)

            // TODO : title is now in tab - test this.
            done()
          })
        })
      })
      loadDataIntoHot(hot, data)
      stubGlobal.restore()
    })
  })

  describe('convert file', () => {
    it('converts a file from csv to tsv', done => {
      let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6'
      let tempFile = `${os.tmpdir()}/mytsv.tsv`
      stubGlobalTab()
      hot.addHook('afterLoadData', () => {
        saveDataToFile(hot, fileFormats.tsv, tempFile, () => {
          fs.readFile(tempFile, 'utf-8', (err, d) => {
            if (err) {
              console.log(err.stack)
            }
            expect(d).to.eq('foo\tbar\tbaz\r\n1\t2\t3\r\n4\t5\t6\r\n')
            done()
          })
        })
      })
      loadDataIntoHot(hot, data)
      stubGlobal.restore()
    })
  })
})
