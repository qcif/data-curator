import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
import {fileFormats} from '../../../../src/renderer/file-formats.js'
const _ = require('lodash')

When('{string} is invoked using the {string}: {string}', async function (name, type, sequence) {
  let result = await invokeActions(this.app, {name: name, type: type, sequence: sequence})
  return result
})

async function invokeActions(app, action) {
  console.log('action is', action)
  // for (action of actions.hashes()) {
  switch (action.type) {
    case 'toolbar menu button':
      await clickOnToolbarMenuButton(app, action.sequence)
      break
    case 'application menu selection':
      console.log('will test application menu...')
      let regexp = new RegExp(/([\w ]+)->([\w ]+)/)
      let matches = action.sequence.match(regexp)
      console.log('matchs for application menu are', matches)
      await clickOnMenuItemFromMenu(app, matches[1], matches[2])
      break
    case 'hot keys combination':
      let array = action.sequence.split('+')
      await keyPress(app, array)
      break
    default:
      throw new Error(`Action type: ${action.type} is not supported.`)
  }
  // }
}

When(/^I click on the "([\w]+?)" toolbar menu/, async function (toolbarMenuName) {
  let result = await clickOnToolbarMenuButton(toolbarMenuName)
  return result
})

When(/^I click on the "([\w]+?)"->"([\w]+?)" menu/, async function (menuLabel, subMenuLabel) {
  // await clickOnMenuItemFromMenu(menuLabel, subMenuLabel)
  console.log(`args are ${menuLabel}, ${subMenuLabel}`)
  const returned = await this.app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel])
  console.log(`returned is`, returned)
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

async function clickOnToolbarMenuButton(app, buttonName) {
  const id = await findToolBarMenuButtonElementIdContainingName(app, buttonName)
  await app.client.elementIdClick(id)
}

async function findToolBarMenuButtonElementIdContainingName(app, buttonName) {
  const selector = '#toolbar .toolbar-text'
  app.client.waitForText(selector)
  let response = await app.client.elements(selector)
  let matches1 = []
  let matches2 = []
  let regexp1 = new RegExp('^' + buttonName + '$', 'i')
  let regexp2 = new RegExp(buttonName, 'i')
  for (const value of response.value) {
    let textJson = await app.client.elementIdText(value.ELEMENT)
    if (textJson) {
      const text = textJson.value
      const match1 = text.match(regexp1)
      const match2 = text.match(regexp2)
      if (match1) {
        matches1.push(value.ELEMENT)
      }
      if (match2) {
        matches2.push(value.ELEMENT)
      }
    }
  }
  // favour more exact match first, otherwise a button that just contains text will do
  let id = matches1.length === 1 ? matches1[0] : matches2.length === 1 ? matches2[0] : null
  if (!id) {
    throw new Error(`Unable to find matching toolbar button menu named: ${buttonName}`)
  }
  return id
}

function getElementIdFromToolbarMenuName(toolbarMenuName) {
  console.log('toolbarMenu name', toolbarMenuName)
  const menu = toolbarMenus.find(x => x.name === toolbarMenuName)
  return menu.id
}

async function clickOnMenuItemFromMenu(app, menuLabel, subMenuLabel) {
  const returned = await app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel])
  expect(returned).to.equal(subMenuLabel)
}

async function keyPress(app, keysArray) {
  console.log(`keys are`, keysArray)
  const mapped = keysArray.map(function(key) {
    const replaced1 = _.replace(key, 'CmdOrCtrl', 'Control')
    const replaced2 = _.replace(replaced1, /^([A-Z])$/, 'f')
    return replaced2
  })
  console.log('mapped is', mapped)
  return app.client.debug()
  let result = await app.client.keys(['Control', 'F', 'NULL'])
  // console.log(`result is`, result)
  // return result
}
