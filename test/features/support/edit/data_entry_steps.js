import { When } from 'cucumber'
import { clickInputFieldName, enterInputInFieldName } from '../page-objects/io'
import { expect } from 'chai'
import { returnInputIdSelector } from '../page-objects/selectors'

When(/^"(.+?)" (?:has been|is) entered in the input field(?: for|)[:]? "(.+?)"/, { timeout: -1 }, async function (value, field) {
  await enterInputInFieldName(this.app, value, field, this.pageShortTimeout)
})

// When(/^(?:the )"(.+?)" input field is clicked/, { timeout: -1 }, async function (field) {
//   await clickInputFieldName(this.app, field, this.pageShortTimeout)
// })

When(/^(?:the )"(.+?)" input checkbox field is not selected/, async function (fieldId) {
  const result = await returnInputIdSelector(this.app, fieldId)
  const isSelected = await result.isSelected()
  console.log(`is selected is ${isSelected}`)
  if (isSelected) {
    console.log('attempting to click...')
    await result.click()
    await result.waitUntil(async function () {
      // not 'interactable' so getText may not work
      const isSelected = await this.isSelected()
      console.log(`is selected now: ${isSelected}`)
      return !isSelected
    })
  }
})

When(/^(?:the )"(.+?)" input checkbox field is selected/, async function (fieldId) {
  const result = await returnInputIdSelector(this.app, fieldId)
  const isSelected = await result.isSelected()
  // console.log(`is selected is ${isSelected}`)
  // if (!isSelected) {
  //   await result.click()
  // }
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
