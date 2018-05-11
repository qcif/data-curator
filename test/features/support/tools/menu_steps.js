import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
import {fileFormats} from '../../../../src/renderer/file-formats.js'
// import {data} from '../../../../src/renderer/components/Home.vue'
const _ = require('lodash')
// const toolbarMenus = data().toolbarMenus

When(/^I {action} (the)? {name} using (the)? {type}/, async function (action, name, type) {
  await invokeActions({action: action, name: name, type: type})
})

async function invokeActions(actions) {
  for (action of actions.hashes()) {
    switch (action.type) {
      case 'toolbar menu button':
        return clickOnToolbarMenuButton(action.name)
        break
      case 'application menu':
        let regexp = new RegExp(/"([\w]+?)"->"([\w]+?)"/)
        let matches = action.name.match(regexp)
        console.log(matches)
        await clickOnMenuItemFromMenu(matches[1], matches[2])
        break
      case 'hot keys':
        let array = action.name.split('+')
        return keyPress(array)
        break
      default:
        throw new Error(`Action type: ${action.type} is not supported.`)
    }
  }
}

When(/^I click on the "([\w]+?)" toolbar menu/, function (toolbarMenuName) {
  return clickOnToolbarMenuButton(toolbarMenuName)
})

When(/^I click on the "([\w]+?)"->"([\w]+?)" menu/, async function (menuLabel, subMenuLabel) {
  // await clickOnMenuItemFromMenu(menuLabel, subMenuLabel)
  const returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel])
  expect(returned).to.equal(subMenuLabel)
})

When(/^I press the key[s]? "([\w]+?)"/, function (key) {
  return keyPress([key])
})

When(/^I press the key[s]? "([\w]+?)\+([\w]+?)"/, function (key1, key2) {
  return keyPress([key1, key2])
})

When(/^I press the key[s]? "([\w]+?)\+([\w]+?)\+([\w]+?)"/, function (key1, key2, key3) {
  return keyPress([key1, key2, key3])
})

// 3rd menu may contain spaces, dots
When(/^I click on the "([\w]+?)"->"([\w]+?)"->"([\w .]+?)" menu/, async function (menuLabel, subMenuLabel, subSubMenuLabel) {
  try {
    let returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel, subSubMenuLabel])
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

function clickOnToolbarMenuButton(buttonName) {
  return this.app.client.waitForVisible('#toolbar')
    .element(getElementIdFromToolbarMenuName(buttonName))
    .click()
}

function getElementIdFromToolbarMenuName(toolbarMenuName) {
  const menu = toolbarMenus.find(x => x.name === toolbarMenuName)
  return menu.id
}

async function clickOnMenuItemFromMenu(menuLabel, subMenuLabel) {
  const returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel])
  expect(returned).to.equal(subMenuLabel)
}

function keyPress(keysArray) {
  return this.app.client.keys(keysArray)
}
