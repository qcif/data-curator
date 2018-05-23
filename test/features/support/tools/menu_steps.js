import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
import { fileFormats } from '../../../../src/renderer/file-formats.js'
import {getFilePathFromFixtures} from '../page-objects/io.js'
import {menu} from '../pageObjects.js'

const _ = require('lodash')

Given(/^"Find" is invoked$/, async function () {
  await menu.invokeActions(this.app, {name: 'Find', type: 'application menu selection', sequence: 'Find->Find'})
})

// When(/^"About" is invoked$/, async function () {
//   await menu.invokeActions(this.app, {name: 'About', type: 'application menu selection', sequence: 'Electron->About'})
// })

When('{string} is invoked using the {string}: {string}', async function (name, type, sequence) {
  await menu.invokeActions(this.app, {name: name, type: type, sequence: sequence})
})

When(/^the "([\w]+?)" toolbar menu is (?:selected|clicked)/, async function (toolbarMenuName) {
  let result = await menu.clickOnToolbarMenuButton(toolbarMenuName)
  return result
})

When(/^the "([\w]+?)"->"([\w]+?)" menu is (?:selected|clicked)/, async function (menuLabel, subMenuLabel) {
  const returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel])
  expect(returned).to.equal(subMenuLabel)
})

// 3rd menu may contain spaces, dots
When(/^the "([\w]+?)"->"([\w]+?)"->"([\w .]+?)" menu is (?:selected|clicked)/, async function (menuLabel, subMenuLabel, subSubMenuLabel) {
  let returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel, subSubMenuLabel])
  expect(returned).to.equal(subSubMenuLabel)
})

Then('the openfile dialog should be displayed', async function () {
  let globalNames = await this.app
    .electron
    .remote
    .getGlobal('openFileDialogReturned')
  expect(globalNames).to.deep.equal(this.openFileDialogReturned)
})

Then('another tab with its filename as the title should be displayed', async function () {
  this.latestFilePath = getFilePathFromFixtures('valid.csv')
  await this.app.electron.ipcRenderer.send('openFileIntoTab', this.latestFilePath, fileFormats.csv)
  let text = await this.app.client
    .timeouts('implicit', 5000)
    .getText('#tab1')
  expect(text).to.equal('valid')
})
