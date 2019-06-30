import { When } from 'cucumber'
import { clickInputFieldName, enterInputInFieldName } from '../page-objects/io'
import { expect } from 'chai'
import { returnInputIdSelector, waitForVisibleInputSelector } from '../page-objects/selectors'

When(/^"(.+?)" (?:has been|is) entered in the input field(?: for|)[:]? "(.+?)"/, { timeout: -1 }, async function (value, field) {
  const result = await enterInputInFieldName(this.app, value, field, this.pageShortTimeout)
  return result
})

When(/^(?:the )"(.+?)" input field is clicked/, { timeout: -1 }, async function (field) {
  const result = await clickInputFieldName(this.app, field, this.pageShortTimeout)
  return result
})

When(/^(?:the )"(.+?)" input checkbox field is not selected/, async function (fieldId) {
  const result = await returnInputIdSelector(this.app, fieldId)
  if (this.app.client.$(result.selector).isSelected()) {
    await this.app.client.$(result.selector).click()
  }
})

When(/^(?:the )"(.+?)" input checkbox field is selected/, async function (fieldId) {
  const result = await returnInputIdSelector(this.app, fieldId)
  if (!this.app.client.$(result.selector).isSelected()) {
    await this.app.client.$(result.selector).click()
  }
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
