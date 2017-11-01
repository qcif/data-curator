import {HotRegister} from '@/hot.js'
import {fixRaggedRows} from '@/ragged-rows.js'
import {expect} from 'chai'

describe('Ragged rows', () => {
  before(() => {
    window._ = require('lodash')
  })

  function stubData() {
    return [
      [
        '', 'Ford', 'Volvo', 'Toyota', 'Honda'
      ],
      [
        '2014', 10, 11, 12, 13
      ],
      [
        '2015', 20, 11, 14, 13
      ],
      ['2016', 30, 15, 12, 13]
    ]
  }

  function stubRaggedData() {
    return [
      [
        '', 'Ford', 'Volvo', 'Toyota', 'Honda'
      ],
      [
        '2014', 10, 11, 12, 13
      ],
      [
        '2015', 20, 11, 14
      ],
      ['2016', 30, 15, 12, 13]
    ]
  }

  describe('Ragged row functions against well formed array of arrays', () => {
    it('parses a well formed (non-ragged) array of rows without change', () => {
      let data = stubData()
      fixRaggedRows(data)
      expect(stubData()).to.deep.equal(data)
    })
  })

  describe('Ragged row functions against ragged array of arrays', () => {
    it('fixes an array with 1 ragged row.', () => {
      let expectedFixedData = [
        [
          '', 'Ford', 'Volvo', 'Toyota', 'Honda'
        ],
        [
          '2014', 10, 11, 12, 13
        ],
        [
          '2015', 20, 11, 14, ''
        ],
        ['2016', 30, 15, 12, 13]
      ]
      let data = stubRaggedData()
      fixRaggedRows(data)
      expect(expectedFixedData).to.deep.equal(data)
      expect(stubRaggedData()).to.not.deep.equal(data)
    })
  })
})
