import { expect, should, assert } from 'chai'

export async function invokeActions (app, action) {
  switch (action.type) {
    case 'toolbar menu button':
      await clickOnToolbarMenuButton(app, action.sequence)
      break
    case 'application menu selection':
      let regexp = new RegExp(/([\w ]+)->([\w ]+)/)
      let matches = action.sequence.match(regexp)
      await clickOnMenuItemFromMenu(app, matches[1], matches[2])
      break
    default:
      throw new Error(`Action type: ${action.type} is not supported.`)
  }
}

export async function clickOnToolbarMenuButton (app, buttonName) {
  const id = await findToolBarMenuButtonElementIdContainingName(app, buttonName)
  await app.client.elementIdClick(id)
}

export async function findToolBarMenuButtonElementIdContainingName (app, buttonName) {
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

export function getElementIdFromToolbarMenuName (toolbarMenuName) {
  const menu = toolbarMenus.find(x => x.name === toolbarMenuName)
  return menu.id
}

export async function clickOnMenuItemFromMenu (app, menuLabel, subMenuLabel) {
  const returned = await app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel])
  expect(returned).to.equal(subMenuLabel)
}
