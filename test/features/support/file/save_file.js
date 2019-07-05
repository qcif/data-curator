import { expect } from 'chai'
import { Given, Then } from 'cucumber'
import { arrayOfLinesToString, saveAndReturnData } from '../page-objects/io'

Given(/^the user presses keys: (.+?)$/, async function (keypresses) {
  let keyArray = JSON.parse(keypresses)
  await this.app.client.keys(keyArray)
})

Then(/^the saved data should match: (.+?)$/, async function (rawExpected) {
  const expected = arrayOfLinesToString(rawExpected)
  let returnedData = await saveAndReturnData(this.app)
  expect(returnedData).to.deep.equal(expected)
})
