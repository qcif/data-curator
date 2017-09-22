/**
 * Created by stephenfortune on 15/09/15.
 */
let assert = require('chai').assert
let expect = require('chai').expect
let should = require('chai').should()

before(function() {
  window._ = require('lodash')
})

describe('populate a web page and check that everything is there', function() {
  it('has document', function () {
    let div = document.createElement('div')
    expect(div.nodeName).eql('DIV')
  })

  it('loads a web page and confirms that changes to DIV are evaluated', function() {
    let div = document.createElement('div')
    let targetdiv = document.createElement('div')
    targetdiv.innerHTML = 'populated'
    expect(targetdiv === div)
    expect(targetdiv.innerText).to.not.equal(div.innerText)
  })
})
