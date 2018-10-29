import Handsontable from 'handsontable/dist/handsontable.full.js'
import { insertRowAbove, insertRowBelow, insertColumnLeft, insertColumnRight } from '@/hot.js'
import store from '@/store/modules/hots.js'
import { resetHotStore } from '../helpers/storeHelper.js'
import { stubHotInDocumentDom, resetHot, registerHot } from '../helpers/basicHotHelper.js'
import { globalBefore } from '../helpers/globalHelper.js'

describe('hands on table', () => {
  let sandbox
  let data
  let expectedData
  let hot

  before(() => {
    globalBefore()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    stubHotInDocumentDom(sandbox)
    hot = registerHot()
    data = stubData()
    expectedData = stubData()
  })

  afterEach(() => {
    resetHot(sandbox)
    resetHotStore()
    data = null
    hot = null
    expectedData = null
    store.mutations.resetHotState(store.state)
    sandbox.restore()
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
      [
        '2016', 30, 15, 12, 13
      ]
    ]
  }


  describe('loading Hands On Table library into workview', () => {
    it('constructs hands on table via controller without altering loaded data', () => {
      hot.addHook('afterLoadData', () => {
        expect(hot.getData()).to.deep.equal(expectedData)
      })
      hot.loadData(data)
    })

    it('returns the same data when loaded via hot controller as it does directly throught hot library', () => {
      let hot2 = new Handsontable(document.querySelector('.stubbedHot'), stubDefaultHotProperties(data))
      hot.addHook('afterLoadData', () => {
        expect(hot.getData()).to.deep.equal(hot2.getData())
      })
      hot.loadData(data)
    })
  })

  describe('Insert rows', () => {
      it('adds a row above (first row)', () => {
        hot.addHook('afterLoadData', () => {
          hot.selectCell(0, 0, 0, 4) // select whole row
          insertRowAbove(true)
          expectedData.unshift([null, null, null, null, null])
          expect(hot.getData()).to.deep.equal(expectedData)
        })
        hot.loadData(data)
      })

      it('adds a row above (middle)', () => {
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
            [
              '2016', 30, 15, 12, 13
            ]
          ])
        })
        hot.loadData(data)
      })

      it('adds a row above (end row)', () => {
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
            [
              '2016', 30, 15, 12, 13
            ]
          ])
        })
        hot.loadData(data)
      })

      it('adds a row below (first row)', () => {
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
            [
              '2016', 30, 15, 12, 13
            ]
          ])
        })
        hot.loadData(data)
      })

      it('adds a row below (middle)', () => {
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
            [
              '2016', 30, 15, 12, 13
            ]
          ])
        })
        hot.loadData(data)
      })

      it('adds a row below (end row)', () => {
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
            [
              null, null, null, null, null
            ]
          ])
        })
        hot.loadData(data)
      })
    })

  describe('Insert columns', () => {
      it('adds a column to the left (first col)', function() {
        let mock = mockPushColumnIndex(sandbox.mock, 0)
        hot.addHook('afterLoadData', () => {
          hot.selectCell(0, 0, 3, 0) // select whole column
          insertColumnLeft()
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
        mock.verify()
      })

      it('adds a column to the left (middle)', function() {
        let mock = mockPushColumnIndex(sandbox.mock, 2)
        hot.addHook('afterLoadData', () => {
          hot.selectCell(2, 2, 2, 2) // select only one cell
          insertColumnLeft()
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
        mock.verify()
      })

      it('adds a column to the left (last col)', function() {
        let mock = mockPushColumnIndex(sandbox.mock, 3)
        hot.addHook('afterLoadData', () => {
          hot.selectCell(1, 3, 2, 4) // select partial rectangular column
          insertColumnLeft()
          assert.deepEqual(hot.getData(), [
            [
              '',
              'Ford',
              'Volvo',
              null,
              'Toyota',
              'Honda'
            ],
            [
              '2014',
              10,
              11,
              null,
              12,
              13
            ],
            [
              '2015',
              20,
              11,
              null,
              14,
              13
            ],
            [
              '2016',
              30,
              15,
              null,
              12,
              13
            ]
          ])
        })
        hot.loadData(data)
        mock.verify()
      })

      it('adds a column to the right (first col)', function() {
        let mock = mockPushColumnIndex(sandbox.mock, 1)
        hot.addHook('afterLoadData', () => {
          hot.selectCell(0, 0, 3, 0) // select whole column
          insertColumnRight()
          assert.deepEqual(hot.getData(), [
            [
              '', null, 'Ford', 'Volvo', 'Toyota', 'Honda'
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
        mock.verify()
      })

      it('adds a column to the right (middle)', function() {
        let mock = mockPushColumnIndex(sandbox.mock, 2)
        hot.addHook('afterLoadData', () => {
          hot.selectCell(1, 1, 1, 1) // select only one cell
          insertColumnRight()
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
        mock.verify()
      })

      it('adds a column to the right (last col)', function() {
        let mock = mockPushColumnIndex(sandbox.mock, 5)
        hot.addHook('afterLoadData', () => {
          hot.selectCell(1, 3, 2, 4) // select a rectangular range
          insertColumnRight()
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
        mock.verify()
      })
  })

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

  function mockPushColumnIndex(sMock, columnIndex) {
    let mock = sMock(store.mutations)
    mock.expects('pushColumnIndexForHotId').withArgs(store.state, {
      hotId: hot.guid,
      columnIndex: columnIndex
    })
    return mock
  }
})
