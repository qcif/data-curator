import {assert} from 'chai'
import {expect} from 'chai'
let should = require('chai').should()

before(() => {
  window._ = require('lodash')
})

describe('populate a web page and check that everything is there', () => {
  it('has document', () => {
    let div = document.createElement('div')
    expect(div.nodeName).eql('DIV')
  })

  it('loads a web page and confirms that changes to DIV are evaluated', () => {
    let div = document.createElement('div')
    let targetdiv = document.createElement('div')
    targetdiv.innerHTML = 'populated'
    expect(targetdiv === div)
    expect(targetdiv.innerText).to.not.equal(div.innerText)
  })
})
