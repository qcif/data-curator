import {ipcMain as ipc, Menu} from 'electron'

ipc.on('toggleSaveMenu', (event, arg) => {
  let saveSubMenu = getSubMenuFromMenu('File', 'Save')
  let activeFilename = global.tab.activeFilename
  saveSubMenu.enabled = (typeof activeFilename !== 'undefined' && activeFilename.length > 0)
})

ipc.on('hasCaseSensitiveHeader', (event, arg) => {
  let subMenu = getSubMenuFromMenu('Tools', 'Case Sensitive Header Row')
  console.log('got return')
  console.log(arg)
  subMenu.checked = arg
})

ipc.on('hasHeaderRow', (event, arg) => {
  let subMenu = getSubMenuFromMenu('Tools', 'Header Row')
  subMenu.checked = arg
})

function getSubMenuFromMenu(menuLabel, subMenuLabel) {
  let menu = Menu.getApplicationMenu().items.find(x => x.label === menuLabel)
  let subMenu = menu.submenu.items.find(x => x.label === subMenuLabel)
  return subMenu
}

ipc.on('clickLabelsOnMenu', function(event, args) {
  try {
    let returned = clickLabelsOnMenu(args)
    event.returnValue = returned
  } catch (error) {
    throw (error)
  }
})

function clickLabelsOnMenu(args) {
  let menu = Menu.getApplicationMenu().items.find(x => x.label === args[0])
  // console.log(menu.submenu.items)
  menu.click()
  let returnLabel = menu.label
  let subMenu
  if (args.length > 1) {
    subMenu = menu.submenu.items.find(x => x.label === args[1])
    subMenu.click()
    returnLabel = subMenu.label
  }
  // // console.log(subMenu.submenu.items)
  if (args.length > 2) {
    let subSubMenu = subMenu.submenu.items.find(x => x.label === args[2])
    // console.log(subSubMenu)
    subSubMenu.click()
    returnLabel = subSubMenu.label
  }
  return returnLabel
}
