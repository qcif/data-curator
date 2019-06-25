import { When } from 'cucumber'
import { enterInputInFieldName } from '../page-objects/io'
import { expect } from 'chai'

When(/^"(.+?)" has been entered in the input field(?: for|)[:]? "(.+?)"/, { timeout: -1 }, async function (value, field) {
  const result = await enterInputInFieldName(this.app, value, field, this.pageShortTimeout)
  return result
})

When(/^the "Column" [Pp]roperties are entered as$/, function (properties) {
  const expected = {
    'Name': 'A Good name',
    'Title': 'This is a title',
    'Description': 'description text',
    'RDF Type': 'rdf value'
  }
  expect(properties.rowsHash()).to.deep.equal(expected)
})
