import {assert, expect, should} from 'chai'
import sinon from 'sinon'
import validate from './../../../src/main/validate'
import Fs from 'fs'

describe('validate', () => {
  it('generates the correct command path', () => {
    expect(validate._private.csvlintPath()).to.match(/bin\/csvlint --json/)
  })

  it('generates the correct command path with a schema', () => {
    let schema = '../../fixtures/all_constraints.json'
    expect(validate._private.csvlintPath(schema)).to.match(/bin\/csvlint --schema=\.\.\/\.\.\/fixtures\/all_constraints\.json --json/)
  })

  it('writes a tmp file', () => {
    let data = 'here,is,some,data'
    let path = validate._private.writeTmpFile(data)
    expect(Fs.readFileSync(path, 'utf8')).to.eq(data)
  })
})
