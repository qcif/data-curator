import chai from 'chai'
import Handsontable from 'handsontable/dist/handsontable.full.js'
import {HotRegister, insertRowAbove, insertRowBelow, insertColumnLeft, insertColumnRight} from '@/hot.js'

let assert = chai.assert
let expect = chai.expect
let should = chai.should()

// function reset() {
//   // hot = null
//   // hotId = null
//   // data = null
//   // expectedData = null
//   resetDocument()
// }

function resetDocument() {
  document.open()
  document.write('<html><body></body></html>')
  document.close()
}

function stubActiveContainer() {
  let hotView = document.createElement('div')
  let childElement = [{attr: 'id', value: 'csvContent'}, {attr: 'class', value: 'active'}, {attr: 'class', value: 'editor'}].reduce(function(parent, elem) {
    let element = document.createElement('div')
    element.setAttribute(elem.attr, elem.value)
    parent.appendChild(element)
    return parent.firstElementChild
  }, hotView)
  document.body.appendChild(hotView)
}

describe('hands on table', () => {
  let data
  let expectedData
  before(() => {
    window._ = require('lodash')
  })

  beforeEach(() => {
    data = stubData()
    expectedData = stubData()
    resetDocument()
    stubActiveContainer()
  })

  afterEach(() => {
    HotRegister.destroyAllHots()
    data = null
    expectedData = null
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

  function stubDefaultHotProperties(data) {
    return {
      data,
      colHeaders: false,
      rowHeaders: true,
      // autoColumnSize: {syncLimit: 300},
      fixedRowsTop: 0,
      // enable when header row function implemented - otherwise header is sorted with values
      columnSorting: true,
      sortIndicator: true,
      contextMenu: false,
      autoRowSize: true,
      autoWrap: true,
      manualRowResize: true,
      manualColumnResize: true,
      manualRowMove: true,
      enterBeginsEditing: false,
      persistentState: true,
      outsideClickDeselects: false
    }
  }

  function registerHot() {
    let container = document.querySelector('.editor')
    let hotId = HotRegister.register(container)
    let hot = HotRegister.getInstance(hotId)
    return hot
  }

  describe('loading Hands On Table library into workview', () => {
    it('constructs hands on table via controller without altering loaded data', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        expect(hot.getData()).to.deep.equal(expectedData)
      })
      hot.loadData(data)
    })

    it('returns the same data when loaded via hot controller as it does directly throught hot library', () => {
      let hot = registerHot()
      let hot2 = new Handsontable(document.querySelector('.editor'), stubDefaultHotProperties(data))
      hot.addHook('afterLoadData', () => {
        expect(hot.getData()).to.deep.equal(hot2.getData())
      })
      hot.loadData(data)
    })
  })

  describe('insertRowAbove tests', () => {
    it('adds a row above (first row)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(0, 0, 0, 4) // select whole row
        insertRowAbove(true)
        expectedData.unshift([null, null, null, null, null])
        expect(hot.getData()).to.deep.equal(expectedData)
      })
      hot.loadData(data)
    })

    it('adds a row above (middle)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(2, 0, 2, 0) // select only one cell
        insertRowAbove(true)
        assert.deepEqual(hot.getData(), [
          [
            '', 'Ford', 'Volvo', 'Toyota', 'Honda'
          ],
          [
            '2014', 10, 11, 12, 13
          ],
          [
            null, null, null, null, null
          ],
          [
            '2015', 20, 11, 14, 13
          ],
          ['2016', 30, 15, 12, 13]
        ])
      })
      hot.loadData(data)
    })

    it('adds a row above (end row)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(3, 2, 3, 4) // select partial row
        insertRowAbove(true)
        assert.deepEqual(hot.getData(), [
          [
            '', 'Ford', 'Volvo', 'Toyota', 'Honda'
          ],
          [
            '2014', 10, 11, 12, 13
          ],
          [
            '2015', 20, 11, 14, 13
          ],
          [
            null, null, null, null, null
          ],
          ['2016', 30, 15, 12, 13]
        ])
      })
      hot.loadData(data)
    })
  })

  describe('insertRowBelow tests', () => {
    it('adds a row below (first row)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(0, 0, 0, 4) // select whole row
        insertRowBelow(true)
        assert.deepEqual(hot.getData(), [
          [
            '', 'Ford', 'Volvo', 'Toyota', 'Honda'
          ],
          [
            null, null, null, null, null
          ],
          [
            '2014', 10, 11, 12, 13
          ],
          [
            '2015', 20, 11, 14, 13
          ],
          ['2016', 30, 15, 12, 13]
        ])
      })
      hot.loadData(data)
    })

    it('adds a row below (middle)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(1, 2, 1, 2) // select only one cell
        insertRowBelow(true)
        assert.deepEqual(hot.getData(), [
          [
            '', 'Ford', 'Volvo', 'Toyota', 'Honda'
          ],
          [
            '2014', 10, 11, 12, 13
          ],
          [
            null, null, null, null, null
          ],
          [
            '2015', 20, 11, 14, 13
          ],
          ['2016', 30, 15, 12, 13]
        ])
      })
      hot.loadData(data)
    })

    it('adds a row below (end row)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(2, 0, 3, 3) // select rectangular area
        insertRowBelow(true)
        assert.deepEqual(hot.getData(), [
          [
            '', 'Ford', 'Volvo', 'Toyota', 'Honda'
          ],
          [
            '2014', 10, 11, 12, 13
          ],
          [
            '2015', 20, 11, 14, 13
          ],
          [
            '2016', 30, 15, 12, 13
          ],
          [null, null, null, null, null]
        ])
      })
      hot.loadData(data)
    })
  })

  describe('insertColumnLeft tests', () => {
    it('adds a column to the left (first col)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(0, 0, 3, 0) // select whole column
        insertColumnLeft(true)
        assert.deepEqual(hot.getData(), [
          [
            null,
            '',
            'Ford',
            'Volvo',
            'Toyota',
            'Honda'
          ],
          [
            null,
            '2014',
            10,
            11,
            12,
            13
          ],
          [
            null,
            '2015',
            20,
            11,
            14,
            13
          ],
          [
            null,
            '2016',
            30,
            15,
            12,
            13
          ]
        ])
      })
      hot.loadData(data)
    })

    it('adds a column to the left (middle)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(2, 2, 2, 2) // select only one cell
        insertColumnLeft(true)
        assert.deepEqual(hot.getData(), [
          [
            '',
            'Ford',
            null,
            'Volvo',
            'Toyota',
            'Honda'
          ],
          [
            '2014',
            10,
            null,
            11,
            12,
            13
          ],
          [
            '2015',
            20,
            null,
            11,
            14,
            13
          ],
          [
            '2016',
            30,
            null,
            15,
            12,
            13
          ]
        ])
      })
      hot.loadData(data)
    })

    it('adds a column to the left (last col)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(1, 4, 2, 4) // select partial column
        insertColumnLeft(true)
        assert.deepEqual(hot.getData(), [
          [
            '',
            'Ford',
            'Volvo',
            'Toyota',
            null,
            'Honda'
          ],
          [
            '2014',
            10,
            11,
            12,
            null,
            13
          ],
          [
            '2015',
            20,
            11,
            14,
            null,
            13
          ],
          [
            '2016',
            30,
            15,
            12,
            null,
            13
          ]
        ])
      })
      hot.loadData(data)
    })
  })

  describe('insertColumnRight tests', () => {
    it('adds a column to the left (first col)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(0, 0, 3, 0) // select whole column
        insertColumnRight(true)
        assert.deepEqual(hot.getData(), [
          [
            '',
            null,
            'Ford',
            'Volvo',
            'Toyota',
            'Honda'
          ],
          [
            '2014',
            null,
            10,
            11,
            12,
            13
          ],
          [
            '2015',
            null,
            20,
            11,
            14,
            13
          ],
          [
            '2016',
            null,
            30,
            15,
            12,
            13
          ]
        ])
      })
      hot.loadData(data)
    })

    it('adds a column to the left (middle)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(1, 1, 1, 1) // select only one cell
        insertColumnRight(true)
        assert.deepEqual(hot.getData(), [
          [
            '',
            'Ford',
            null,
            'Volvo',
            'Toyota',
            'Honda'
          ],
          [
            '2014',
            10,
            null,
            11,
            12,
            13
          ],
          [
            '2015',
            20,
            null,
            11,
            14,
            13
          ],
          [
            '2016',
            30,
            null,
            15,
            12,
            13
          ]
        ])
      })
      hot.loadData(data)
    })

    it('adds a column to the left (last col)', () => {
      let hot = registerHot()
      hot.addHook('afterLoadData', () => {
        hot.selectCell(1, 3, 2, 4) // select a rectangular range
        insertColumnRight(true)
        assert.deepEqual(hot.getData(), [
          [
            '',
            'Ford',
            'Volvo',
            'Toyota',
            'Honda',
            null
          ],
          [
            '2014',
            10,
            11,
            12,
            13,
            null
          ],
          [
            '2015',
            20,
            11,
            14,
            13,
            null
          ],
          [
            '2016',
            30,
            15,
            12,
            13,
            null
          ]
        ])
      })
      hot.loadData(data)
    })
  })
})
