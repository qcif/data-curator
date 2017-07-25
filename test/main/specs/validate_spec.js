var assert = require('chai').assert
var expect = require('chai').expect
var should = require('chai').should()
var sinon = require('sinon')

var validate = require('./../../../src/main/validate')

var Fs = require('fs')

describe('validate', function() {
  it('generates the correct command path', function() {
    expect(validate._private.csvlintPath()).to.match(/bin\/csvlint --json/)
  })

  it('generates the correct command path with a schema', function() {
    let schema = '../../fixtures/all_constraints.json'
    expect(validate._private.csvlintPath(schema)).to.match(/bin\/csvlint --schema=\.\.\/\.\.\/fixtures\/all_constraints\.json --json/)
  })

  it('writes a tmp file', function() {
    let data = 'here,is,some,data'
    let path = validate._private.writeTmpFile(data)
    expect(Fs.readFileSync(path, 'utf8')).to.eq(data)
  })
})
