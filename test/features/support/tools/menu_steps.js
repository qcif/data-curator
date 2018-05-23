import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
import { fileFormats } from '../../../../src/renderer/file-formats.js'
import {getFilePathFromFixtures} from '../page-objects/io.js'
import {menu} from '../pageObjects.js'

const _ = require('lodash')

When('{string} is invoked using the {string}: {string}', async function (name, type, sequence) {
  // try {
  await menu.invokeActions(this.app, {name: name, type: type, sequence: sequence})
  // } catch (error) {
  //   if (error instanceof AssertionError) {
  //     throw new Error(error)
  //   } else {
  //     console.log('failed', error)
  //   }
  // }
})

When(/^the "([\w]+?)" toolbar menu is (?:selected|clicked)/, async function (toolbarMenuName) {
  let result = await menu.clickOnToolbarMenuButton(toolbarMenuName)
  return result
})

When(/^the "([\w]+?)"->"([\w]+?)" menu is (?:selected|clicked)/, async function (menuLabel, subMenuLabel) {
  const returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel])
  expect(returned).to.equal(subMenuLabel)
})

// When(/^I press the key[s]? "([\w]+?)"/, function (key) {
//   return keyPress([key])
// })
//
// When(/^I press the key[s]? "([\w]+?)\+([\w]+?)"/, function (key1, key2) {
//   return keyPress([key1, key2])
// })
//
// When(/^I press the key[s]? "([\w]+?)\+([\w]+?)\+([\w]+?)"/, function (key1, key2, key3) {
//   return keyPress([key1, key2, key3])
// })

// 3rd menu may contain spaces, dots
When(/^the "([\w]+?)"->"([\w]+?)"->"([\w .]+?)" menu is (?:selected|clicked)/, async function (menuLabel, subMenuLabel, subSubMenuLabel) {
  try {
    let returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel, subSubMenuLabel])
    expect(returned).to.equal(subSubMenuLabel)
  } catch (error) {
    throw error
  }
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
