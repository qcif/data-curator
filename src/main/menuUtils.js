import { Menu } from 'electron'
import _ from 'lodash'
//
// _defaultEnabledFileMenuItems = ['New', 'OpenExcelSheet...']
// _defaultEnabledFileMenuSubMenus = ['Open', 'Open Data Package', 'Save As']

export function getMenu (menuLabel) {
  let menu = Menu.getApplicationMenu().items.find(x => x.label === menuLabel)
  return menu
}

// export function getDefaultMenuItemsEnabled(menuLabel) {
//   const menu = getMenu(menuLabel)
// }
//
// export function enableAllFileMenuItems() {
//   enableAllFromLabels('File', ['Open', 'Open Data Package', 'Save As'])
// }
//
// export function disableAllFileMenuItems() {
//   for (const label of ['Open', 'Open Data Package', 'Save As']) {
//     disableAllSubMenuItemsFromMenuObject(getSubMenuFromMenu(menuLabel, label))
//   }
//   disableAllFromLabels('File')
// }

export function enableAllFromLabels(menuLabel, subMenuLabels) {
  enableAllSubMenuItemsFromMenuLabel(menuLabel)
  for (const label of subMenuLabels) {
    enableAllSubMenuItemsFromMenuObject(getSubMenuFromMenu(menuLabel, label))
  }
}

export function disableAllFromLabels(menuLabel, subMenuLabels) {
  disableAllSubMenuItemsFromMenuLabel(menuLabel)
  for (const label of subMenuLabels) {
    disableAllSubMenuItemsFromMenuObject(getSubMenuFromMenu(menuLabel, label))
  }
}

export function enableAllSubMenuItemsFromMenuLabel (menuLabel) {
  let menu = getMenu(menuLabel)
  enableAllSubMenuItemsFromMenuObject(menu)
}

export function enableAllSubMenuItemsFromMenuObject (menu) {
  menu.submenu.items.forEach(function (x) {
    x.enabled = !!x.label
  })
}

export function disableAllSubMenuItemsFromMenuLabel (menuLabel) {
  let menu = getMenu(menuLabel)
  disableAllSubMenuItemsFromMenuObject(menu)
}

export function disableAllSubMenuItemsFromMenuObject (menu) {
  menu.submenu.items.forEach(function (x) {
    if (typeof x.label !== 'undefined') {
      x.enabled = false
    }
  })
}

export function disableMenuItem(menu) {
  menu.enabled = false
}

export function enableMenuItem(menu) {
  menu.enabled = true
}

export function getSubMenuLabelsFromMenu (menuLabel) {
  let menu = getMenu(menuLabel)
  let subMenuLabels = menu.submenu.items.map(x => x.label)
  return subMenuLabels
}

// export function disableSubMenusAndItemsFromMenu (menu) {
//   applyFnToSubMenusAndItemsFromMenu(menu, disableAllSubMenuItemsFromMenuObject, disableMenuItem)
// }
//
// export function enableSubMenusAndItemsFromMenu (menu) {
//   applyFnToSubMenusAndItemsFromMenu(menu, disableAllSubMenuItemsFromMenuObject, disableMenuItem)
// }

// export function applyFnToSubMenusAndItemsFromMenu (menu, subMenuFn, itemsFn) {
//   for (const next of menu.submenu.items) {
//     switch (next.type) {
//       case 'submenu':
//         subMenuFn(next)
//         break
//       case 'normal':
//       case 'checkbox':
//       case 'radio':
//         itemsFn(next)
//         break
//       default:
//         console.log(`skipping `, next.type)
//     }
//   }
// }

export function disableOpenFileItems() {
  applyFnsToLabelsFromMenuLabel('File', ['Open Excel Sheet...', 'Open', 'Open Data Package'], disableAllSubMenuItemsFromMenuObject, disableMenuItem)
}

export function enableOpenFileItems() {
  applyFnsToLabelsFromMenuLabel('File', ['Open Excel Sheet...', 'Open', 'Open Data Package'], enableAllSubMenuItemsFromMenuObject, enableMenuItem)
}

export function applyFnsToLabelsFromMenuLabel(menuLabel, labels, subMenuFn, menuItemFn) {
  const menu = getMenu(menuLabel)
  for (const next of menu.submenu.items) {
    if (_.indexOf(labels, next.label) > -1) {
      switch (next.type) {
        case 'submenu':
          subMenuFn(next)
          break
        case 'normal':
        case 'checkbox':
        case 'radio':
          menuItemFn(next)
          break
        default:
          // console.log(`skipping `, next.type)
      }
    }
  }
}

export function getSubMenusAndItemsFromMenu (menu) {
  let subMenusOnly = []
  let menuItemsOnly = []
  for (const next of menu.submenu.items) {
    switch (next.type) {
      case 'submenu':
        subMenusOnly.push(next)
        break
      case 'normal':
      case 'checkbox':
      case 'radio':
        menuItemsOnly.push(next)
        break
      default:
        // console.log(`skipping `, next.type)
    }
  }
  return {subMenusOnly, menuItemsOnly}
}

export function getSubMenuFromMenu (menuLabel, subMenuLabel) {
  let menu = getMenu(menuLabel)
  let subMenu = menu.submenu.items.find(x => x.label === subMenuLabel)
  return subMenu
}

export function enableSubMenuItemsFromMenuObject (menu, labels) {
  for (const label of labels) {
    const subMenu = menu.submenu.items.find(x => x.label === label)
    subMenu.enabled = true
  }
}

export function disableSubMenuItemsFromMenuObject (menu, labels) {
  for (const label of labels) {
    const subMenu = menu.submenu.items.find(x => x.label === label)
    subMenu.enabled = false
  }
}

export function clickLabelsOnMenu (args) {
  let menu = Menu.getApplicationMenu().items.find(x => x.label === args[0])
  let returnLabel
  if (menu) {
    menu.click()
    returnLabel = menu.label
    if (args.length > 1) {
      let subMenu = menu.submenu.items.find(x => x.label === args[1])
      if (subMenu && subMenu.enabled) {
        subMenu.click()
        returnLabel = subMenu.label
        if (args.length > 2) {
          let subSubMenu = subMenu.submenu.items.find(x => x.label === args[2])
          if (subSubMenu && subSubMenu.enabled) {
            subSubMenu.click()
            returnLabel = subSubMenu.label
          }
        }
      }
    }
  }
  return returnLabel
}
