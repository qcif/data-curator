import { expect } from 'chai'
import { toolbarMenuButtonSelector } from './selectors'

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
  const elObject = await findToolBarMenuButtonElementObjectContainingName(app, buttonName)
  const el = await app.client.$(elObject)
  await el.click()
}

export async function findToolBarMenuButtonElementObjectContainingName (app, buttonName) {
  let els = await app.client.$$(toolbarMenuButtonSelector)
  let exactMatches = []
  let looseMatches = []
  let exactRegex = new RegExp('^' + buttonName + '$', 'i')
  let looseRegex = new RegExp(buttonName, 'i')
  for (const el of els) {
    const text = await el.getText()
    const exactMatch = text.match(exactRegex)
    const looseMatch = text.match(looseRegex)
    if (exactMatch) {
      exactMatches.push(el)
    }
    if (looseMatch) {
      looseMatches.push(el)
    }
  }
  // favour more exact match first, otherwise a button that just contains text will do
  let el = exactMatches.length === 1 ? exactMatches[0] : looseMatches.length === 1 ? looseMatches[0] : null
  if (!el) {
    throw new Error(`Unable to find a unique matching toolbar button menu named: ${buttonName}`)
  }
  return el
}

export function getElementIdFromToolbarMenuName (toolbarMenuName) {
  const menu = toolbarMenus.find(x => x.name === toolbarMenuName)
  return menu.id
}

export async function clickOnMenuItemFromMenu (app, menuLabel, subMenuLabel) {
  const returned = await app.electron.ipcRenderer.sendSync('clickLabelsOnMenu', [menuLabel, subMenuLabel])
  expect(returned).to.equal(subMenuLabel)
}
