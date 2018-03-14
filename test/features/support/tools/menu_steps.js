import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before} from 'cucumber'
import {fileFormats} from '../../../../src/renderer/file-formats.js'
const _ = require('lodash')

When(/^I click on the "([\w]+?)"->"([\w]+?)" menu/, async function (menuLabel, subMenuLabel) {
  let returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel])
  console.log(returned)
  expect(returned).to.equal(subMenuLabel)
})

// 3rd menu may contain spaces, dots
When(/^I click on the "([\w]+?)"->"([\w]+?)"->"([\w \.]+?)" menu/, async function (menuLabel, subMenuLabel, subSubMenuLabel) {
  try {
    let returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel, subSubMenuLabel])
    console.log(returned)
    expect(returned).to.equal(subSubMenuLabel)
  } catch (error) {
    throw error
  }
})

Then('I should see the openfile dialog', async function () {
  let globalNames = await this.app
    .electron
    .remote
    .getGlobal('openFileDialogReturned')
  console.log(globalNames)
  expect(globalNames).to.deep.equal(this.openFileDialogReturned)
})

Then('another tab is opened with its filename as the title', async function () {
  let filePath = require('path').join(__dirname, '../../../fixtures/valid.csv')
  await this.app.electron.ipcRenderer.send('openFileIntoTab', filePath, fileFormats.csv)
  let text = await this.app.client
    .timeouts('implicit', 5000)
    .getText('#tab1')
  expect(text).to.equal('valid')
})
