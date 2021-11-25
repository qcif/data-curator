import { expect } from 'chai'
import { Then } from 'cucumber'
import { sendOpenUrlCall } from '../page-objects/helpers.js'
import { expectedMockShellMessage } from '../page-objects/mockMainProcess'

Then(/^a call to open an external url (?:should be|is) made/, async function () {
  let value = await sendOpenUrlCall('https://qcif.github.io/data-curator-help')
  const resultlogs = await this.app.client.getMainProcessLogs()
  let hasReceivedShellMock = false
  for (let log of resultlogs) {
    if (log.includes(expectedMockShellMessage)) {
      hasReceivedShellMock = true
    }
  }
  expect(value).to.equal(true)
  expect(hasReceivedShellMock).to.equal(true)
})
