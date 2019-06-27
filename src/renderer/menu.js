import { insertRowAbove, insertRowBelow, insertColumnBefore, insertColumnAfter, removeRows, removeColumns } from '@/hot.js'
import { sharedMenus } from '@/sharedWithMain.js'
import _ from 'lodash'
import { remote } from 'electron'
import { getMenu } from '../main/menuUtils'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

function buildMenuItems(options, clickFn) {
  let nextMenu = new MenuItem(_.assign({}, options, { click: function() { clickFn() } }))
  return nextMenu
}

var menu = new Menu()

menu.append(new MenuItem({ type: 'separator' }))
menu.append(buildMenuItems(sharedMenus.insertRowAbove, insertRowAbove))
menu.append(buildMenuItems(sharedMenus.insertRowBelow, insertRowBelow))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(buildMenuItems(sharedMenus.insertColumnBefore, insertColumnBefore))
menu.append(buildMenuItems(sharedMenus.insertColumnAfter, insertColumnAfter))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(buildMenuItems(sharedMenus.removeRows, removeRows))
menu.append(buildMenuItems(sharedMenus.removeColumns, removeColumns))

export function disableEnableContextMenu(isLocked) {
  menu.items.forEach(function (x) {
    if (typeof x.label !== 'undefined' && x['lockable']) {
      x.enabled = !isLocked
    }
  })
}

export {
  menu, sharedMenus
}
