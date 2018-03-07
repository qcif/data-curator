import {rows} from '@/ragged-rows'
import {saveDataToFile, loadDataIntoHot} from '@/data-actions'
import {fileFormats} from '@/file-formats'
import {remote} from 'electron'
import fs from 'fs'
import os from 'os'
import * from '../helper.js'
import chai from 'chai'
let assert = chai.assert
let expect = chai.expect
let should = chai.should()
// const util = require('util')
// const readF = util.promisify(fs.readFile)

describe('file actions', () => {
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
