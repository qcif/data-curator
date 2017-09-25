import {assert, expect, should} from 'chai'
import datapackage from './../../../src/main/datapackage'

describe('methods access for datapackage object', () => {
  // console.log(JSON.stringify(process.env));
  // expect(datapackage.hello).to.be.a('function');
  it('can successfully import an exported function and access private methods', () => {
    expect(datapackage.exportdata).to.be.a('function')
    expect(datapackage._private.inputToVocab).to.be.a('function')
    expect(datapackage._private.zipPackage).to.be.a('function')
  })

  // expect(add).to.be.a('function');
})

describe('testing datapackage', () => {
  it('generates a vocabulary from an array', () => {
    const input = {
      description: 'description',
      keywords: 'tags',
      license: 'cc-by-sa',
      name: 'name',
      title: 'title'
    }

    const vocab = datapackage._private.inputToVocab(input, {}, {
      label: 'Comma separated',
      filters: [
        { name: 'csv files', extensions: ['csv'] }
      ],
      options: { separator: ',', delimiter: '"' },
      mime_type: 'text/csv',
      default_extension: 'csv'
    }) // creates object

    expect(vocab).to.have.all.keys('description', 'keywords', 'license', 'name', 'title', 'resources')
    expect(vocab['resources'][0]).to.have.all.keys('name', 'path', 'mediatype', 'schema')
  })
})
