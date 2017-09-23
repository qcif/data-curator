import {HotRegister} from '@/hot.js'
import chai from 'chai'
import {rows} from '@/ragged-rows'
import * as file_actions from '@/file-actions'
import { mutations } from '@/store'
import fs from 'fs'
import os from 'os'

let assert = chai.assert
let expect = chai.expect
let should = chai.should()

items = {}

describe('file actions', () => {
  let hot
  let hotId
  before(function() {
    window._ = require('lodash')
  })

  beforeEach(() => {
    let hotView = document.createElement('div')
    document.body.appendChild(hotView)
    hotId = HotRegister.register(hotView)
    hot = HotRegister.getInstance(hotId)
    spyOn(global.localStorage, 'setItem').andCallFake (key, item) -> items[key] = item.toString(); undefined
    spyOn(global.localStorage, 'getItem').andCallFake (key) -> items[key] ? null
    spyOn(global.localStorage, 'removeItem').andCallFake (key) -> delete items[key]; undefined
  })

  afterEach(() => {
    HotRegister.destroy(hotId)
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
      file_actions.open(hot, data)
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
      file_actions.open(hot, data, file_actions.formats.semicolon)
    })
  })

  describe('saving csv data into a file', () => {
    it('saves simple csv data to a file, with data intact', done => {
      let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6\r\n'
      hot.addHook('afterLoadData', () => {
        file_actions.save(hot, file_actions.formats.csv, `${os.tmpdir()}/mycsv.csv`)
        let callback = fs.readFile(`${os.tmpdir()}/mycsv.csv`, 'utf-8', (err, d) => {
          if (err) {
            console.log(err.stack)
          }
          expect(d).to.eq(data)
          expect(document.title).to.eq(`${os.tmpdir()}/mycsv.csv`)
          done()
        })
      })
      file_actions.open(hot, data)
    })
  })

  describe('convert file', () => {
    it('converts a file from csv to tsv', done => {
      let data = 'foo,bar,baz\r\n1,2,3\r\n4,5,6'
      hot.addHook('afterLoadData', () => {
        file_actions.save(hot, file_actions.formats.tsv, `${os.tmpdir()}/mytsv.tsv`, () => {
          fs.readFile(`${os.tmpdir()}/mytsv.tsv`, 'utf-8', (err, d) => {
            if (err) {
              console.log(err.stack)
            }
            expect(d).to.eq('foo\tbar\tbaz\r\n1\t2\t3\r\n4\t5\t6\r\n')
            done()
          })
        })
      })
      file_actions.open(hot, data)
    })
  })
})
