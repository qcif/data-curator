import {HotRegister} from './../../src/renderer/hot.js'

// process.env.NODE_ENV = 'test'

import {assert} from 'chai'

import {expect} from 'chai'
let should = require('chai').should()

// let hotController = require('./../../src/renderer/hot.js')
import raggedRows from './../../src/renderer/ragged-rows.js'

import $ from 'jquery/dist/jquery.js'

before(() => {
  let rpanel = document.createElement('div')
  rpanel.setAttribute('id', 'right-panel')
  let mpanel = document.createElement('div')
  mpanel.setAttribute('id', 'message-panel')
  document.body.appendChild(mpanel)
  document.body.appendChild(rpanel)
  window._ = require('lodash')
})

beforeEach(() => {
  let hotView = document.createElement('div')
  document.body.appendChild(hotView)
  HotRegister.register(hotView)
  let hot = HotRegister.getActiveInstance()
})

function stubContainer() {
  let element = document.createElement('div')
  // document.body.appendChild(element)
  return element
}

describe('testing ragged row functions against 2D array', () => {
  it('well formed array results in no DOM change', () => {
    hot = hotController.create(stubContainer())
    let data = [
      ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
      ['2014', 10, 11, 12, 13],
      ['2015', 20, 11, 14, 11],
      ['2016', 30, 15, 12, 13]
    ]

    hot.loadData(data)
    raggedRows.fixRaggedRows(hot, hot.getData())
    console.log('inner text:')
    console.log(mpanel.innerText)
    expect(mpanel.innerText).to.not.have.string('has been added to file')
  })

  it('checks a loaded CSV and returns prompt on first discovery of ragged row', () => {
    hot = hotController.create(stubContainer())
    let data = [
      ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
      ['2014', 10, 11, 12, 13],
      ['2015', 20, 11, 14],
      ['2016', 30, 15, 12, 13]
    ]
    hot.loadData(data)
    raggedRows.fixRaggedRows(hot, hot.getData(), true)
    expect(mpanel.innerText).to.have.string('has been added to file')
  })

  it('changes a HandsOnTable object, given a ragged array, when prompt is answered with yes', () => {
    hot = hotController.create(stubContainer())
    let data = [
      ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
      ['2014', 10, 11, 12, 13],
      ['2015', 20, 11, 14],
      ['2016', 30, 15, 12, 13]
    ]

    hot.loadData(data)
    raggedRows.fixRaggedRows(hot, hot.getData(), true)
    expect(mpanel.innerText).to.have.string('has been added to file')
  })

  it('if ragged rows present and user consent it parses the entire CSV', () => {
    hot = hotController.create(stubContainer())
    let data = [
      ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
      ['2014', 10, 11, 12, 13],
      ['2015', 20, 11, 14],
      ['2016', 30, 15, 12, 13],
      ['2014', 10, 11, 12, 13],
      ['2015', 20, 11, 14],
      ['2016', 30, 15, 12, 13]
    ]

    hot.loadData(data)
    raggedRows.fixRaggedRows(hot, hot.getData(), true)
    expect(mpanel.innerText).to.have.string('has been added to file')
  })
})
