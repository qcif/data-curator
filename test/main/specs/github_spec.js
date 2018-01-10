import path from 'path'
import {assert, expect, should} from 'chai'
import * as github from '../../../src/main/github'
import sinon from 'sinon'
import Fs from 'fs'

describe('github', () => {
  describe('checkForAPIKey', () => {
    it('extracts the API key from a URL', () => {
      let url = 'https://octopub.io/redirect?api_key=foobarbaz'
      expect(github._private.checkForAPIKey(url)[0]).to.eq(url)
      expect(github._private.checkForAPIKey(url)[1]).to.eq('foobarbaz')
    })

    it('returns nothing when the url does not match', () => {
      let url = 'http://octopub.herokuapp.com/foo'
      expect(github._private.checkForAPIKey(url)).to.eq(null)
    })
  })

  describe('writeData', () => {
    it('writes a data to a file', () => {
      let data = 'here,is,some,data'
      let filename = 'My File Name'
      let path = github._private.writeData(data, filename)
      expect(path).to.eq(`${require('os-tmpdir')()}/my-file-name.csv`)
      expect(Fs.readFileSync(path, 'utf8')).to.eq(data)
    })
  })

  describe('postData', () => {
    it('posts data to the right place', () => {
      let dataset = {
        'name': 'My awesome dataset',
        'description': 'My awesome description',
        'file_name': 'My File Name',
        'file_description': 'My File Description',
        'publisher_name': 'Publisher Name',
        'publisher_url': 'http://example.com',
        'license': 'CC-ZERO',
        'frequency': 'monthly'
      }

      let file = path.join(__dirname, '/../fixtures/fixture.csv')

      let stub = sinon.stub(github._private.request, 'post')

      github._private.postData(dataset, file, 'bogus-key')

      let opts = {
        url: 'https://octopub.io/api/datasets',
        json: true,
        headers: {
          'Authorization': 'bogus-key'
        },
        formData: {
          'dataset[name]': 'My awesome dataset',
          'dataset[description]': 'My awesome description',
          'dataset[publisher_name]': 'Publisher Name',
          'dataset[publisher_url]': 'http://example.com',
          'dataset[license]': 'CC-ZERO',
          'dataset[frequency]': 'monthly',
          'file[title]': 'My File Name',
          'file[description]': 'My File Description',
          'file[file]': sinon.match.instanceOf(Fs.ReadStream)
        }
      }

      expect(stub.calledWithMatch(opts)).to.eq(true)

      github._private.request.post.restore()
    })
  })

  describe('putData', () => {
    it('puts data to the right place', () => {
      let file = path.join(__dirname, './../../fixtures/fixture.csv')

      let dataset = {
        dataset: 123,
        file_name: 'My file name',
        file_description: 'My file description'
      }

      let stub = sinon.stub(github._private.request, 'post')
      github._private.putData(dataset, file, 'bogus-key')

      let opts = {
        url: 'https://octopub.io/api/datasets/123/files',
        json: true,
        headers: {
          'Authorization': 'bogus-key'
        },
        formData: {
          'file[title]': 'My file name',
          'file[description]': 'My file description',
          'file[file]': sinon.match.instanceOf(Fs.ReadStream)
        }
      }

      expect(stub.calledWithMatch(opts)).to.eq(true)

      github._private.request.post.restore()
    })
  })
})
