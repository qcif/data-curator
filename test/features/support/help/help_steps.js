import { expect } from 'chai'
import { Then } from 'cucumber'
import { sendOpenUrlCall } from '../page-objects/helpers.js'

Then(/^a call to open an external url (?:should be|is) made/, async function () {
  let value = await sendOpenUrlCall('https://odiqueensland.github.io/data-curator-help')
  const resultlogs = await this.app.client.getMainProcessLogs()
  for (let log of resultlogs) {
    console.dir(log)
  }
  expect(value).to.equal(true)
})
