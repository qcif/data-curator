import { openFile, saveFileAs, saveFile, importDataPackage } from './file.js'
import { showUrlDialog } from './url.js'
import { createWindowTab, focusMainWindow } from './windows.js'
import { importExcel } from './excel.js'
import { showKeyboardHelp } from './help.js'
import { fileFormats } from '../renderer/file-formats.js'
import { shell, BrowserWindow, Menu } from 'electron'

class AppMenu {
  initTemplate () {
    const webContents = this.webContents
    this.template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New',
            accelerator: 'CmdOrCtrl+N',
            click () {
              createWindowTab()
            }
          }, {
            type: 'separator'
          }, {
            label: 'Open',
            submenu: this.openSubMenu
          }, {
            label: 'Open Excel Sheet...',
            enabled: true,
            click () {
              importExcel()
            }
            // Placeholder for future feature
            //      }, {
            //        label: 'Open Google Sheet...',
            //        enabled: false
          }, {
            label: 'Open Data Package',
            submenu: this.openDataPackageSubMenu,
            enabled: true
          }, {
            // Placeholder for future feature
            //      }, {
            //        label: 'Open Recent',
            //        submenu: [
            //          {
            //            label: 'example.csv',
            //            enabled: false
            //          }, {
            //            type: 'separator'
            //          }, {
            //            label: 'Clear Menu',
            //            enabled: false
            //          }
            //        ]
            type: 'separator'
          }, {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            click () {
              saveFile()
            },
            id: 'save',
            enabled: false
          }, {
            label: 'Save As',
            submenu: this.saveSubMenu
          }
          // hide until needed
          //, {
          //  type: 'separator'
          // }
          // hide until implemened
          //, {
          //  label: 'Close Tab',
          //  accelerator: 'CmdOrCtrl+W'
          // }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            click () {
              webContents().send('editUndo')
            }
          }, {
            label: 'Redo',
            accelerator: process.platform === 'darwin'
              ? 'Shift+CmdOrCtrl+Z'
              : 'CmdOrCtrl+Y',
            click () {
              webContents().send('editRedo')
            }
          }, {
            type: 'separator'
          },
          // electron roles for copy/cut/paste seem to be more reliable than equivalent for hot
          {
            role: 'cut',
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X'
          }, {
            role: 'copy',
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C'
          }, {
            role: 'paste',
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V'
          },
          // {
          //    turned off for Beta release
          //    role: 'selectall',
          //   label: 'Select All',
          //   enabled: false,
          //   accelerator: 'CmdOrCtrl+A'
          // },
          {
            type: 'separator'
          }, {
            label: 'Insert Row Above',
            accelerator: 'CmdOrCtrl+I',
            click () {
              webContents().send('insertRowAbove')
            }
          }, {
            label: 'Insert Row Below',
            accelerator: 'CmdOrCtrl+K',
            click () {
              webContents().send('insertRowBelow')
            }
          }, {
            type: 'separator'
          }, {
            label: 'Insert Column Before',
            accelerator: 'CmdOrCtrl+J',
            click () {
              webContents().send('insertColumnLeft')
            }
          }, {
            label: 'Insert Column After',
            accelerator: 'CmdOrCtrl+L',
            click () {
              webContents().send('insertColumnRight')
            }
          }, {
            type: 'separator'
          }, {
            label: 'Remove Row(s)',
            click () {
              webContents().send('removeRows')
            }
          }, {
            label: 'Remove Column(s)',
            click () {
              webContents().send('removeColumns')
            }
          }
        ]
      },
      {
        label: 'Find',
        submenu: [
          {
            label: 'Find',
            accelerator: 'CmdOrCtrl+F',
            click: function () {
              webContents().send('showSidePanel', 'findReplace')
            }
          }, {
            type: 'separator'
          }, {
            label: 'Find Next',
            accelerator: 'CmdOrCtrl+G',
            enabled: false,
            click: function () {
              webContents().send('clickFindButton', 'findNext')
            }
          }, {
            label: 'Find Previous',
            accelerator: 'Alt+CmdOrCtrl+G',
            enabled: false,
            click: function () {
              webContents().send('clickFindButton', 'findPrevious')
            }
          }, {
            type: 'separator'
          }, {
            label: 'Replace Next',
            accelerator: 'CmdOrCtrl+E',
            enabled: false,
            click: function () {
              webContents().send('clickFindButton', 'replaceNext')
            }
          }, {
            label: 'Replace Previous',
            accelerator: 'Alt+CmdOrCtrl+E',
            enabled: false,
            click: function () {
              webContents().send('clickFindButton', 'replacePrevious')
            }
          }, {
            label: 'Replace All',
            enabled: false,
            click: function () {
              webContents().send('clickFindButton', 'replaceAll')
            }
          }
        ]
      },
      {
        label: 'Tools',
        submenu: [
          {
            label: 'Header Row',
            accelerator: 'Shift+CmdOrCtrl+H',
            type: 'checkbox',
            checked: false,
            click (menuItem) {
              // revert 'checked' toggle so only controlled by header row event
              menuItem.checked = !menuItem.checked
              webContents().send('toggleActiveHeaderRow')
            }
          },
          {
            label: 'Case Sensitive Header Row',
            type: 'checkbox',
            checked: false,
            click (menuItem) {
              // revert 'checked' toggle so only controlled by event
              menuItem.checked = !menuItem.checked
              webContents().send('toggleCaseSensitiveHeader')
            }
          }, {
            // Placeholder for future features
            //      }, {
            //        type: 'separator'
            //      }, {
            //        label: 'Import Column Properties...',
            //        enabled: false
            //      }, {
            //        type: 'separator'
            //      }, {
            //        label: 'Create Constraint from Column',
            //        enabled: false
            //      }, {
            //        label: 'Create Reference Table from Column',
            //        enabled: false
            // }, {
            //  type: 'separator'
            // }, {
            label: 'Guess Column Properties',
            accelerator: 'Shift+CmdOrCtrl+G',
            click: function () {
              webContents().send('guessColumnProperties')
            }
          }, {
            type: 'separator'
          }, {
            label: 'Set Column Properties',
            accelerator: process.env.NODE_ENV !== 'development' ? 'Shift+CmdOrCtrl+C' : 'Alt+CmdOrCtrl+C',
            click () {
              webContents().send('triggerMenuButton', 'Column')
            }
          }, {
            label: 'Set Table Properties',
            accelerator: 'Shift+CmdOrCtrl+T',
            click () {
              webContents().send('triggerMenuButton', 'Table')
            }
          }, {
            label: 'Set Provenance Information',
            accelerator: 'Shift+CmdOrCtrl+P',
            click () {
              webContents().send('triggerMenuButton', 'Provenance')
            }
          }, {
            label: 'Set Data Package Properties',
            accelerator: 'Shift+CmdOrCtrl+D',
            click () {
              webContents().send('triggerMenuButton', 'Package')
            }
          }, {
            type: 'separator'
          }, {
            label: 'Validate Table',
            accelerator: 'Shift+CmdOrCtrl+V',
            click () {
              webContents().send('validateTable')
            }
          }, {
            type: 'separator'
          }, {
            label: 'Export Data Package...',
            accelerator: 'Shift+CmdOrCtrl+X',
            click () {
              webContents().send('triggerMenuButton', 'Export')
            }
          }
          // Placeholder for future features
          //      , {
          // Conditionally enabled based on API keys set and Data Package Exported
          //        label: 'Publish Data Package to',
          //        enabled: false,
          //        submenu: [
          //          {
          //            label: 'CKAN',
          //            enabled: false
          //          , icon: '/static/img/locked.svg'
          //          }, {
          //            label: 'DataHub',
          //            enabled: false
          //          , icon: '/static/img/locked.svg'
          //          }, {
          //            label: 'OctoPub',
          //            enabled: false
          //          , icon: '/static/img/locked.svg'
          //          }
          //        ]
          //      }
        ]
      },
      {
        label: 'Window',
        submenu: [
          {
            role: 'minimize'
          }, {
            role: 'zoom'
            // hide until implemented
            // }, {
            //   type: 'separator'
            // }, {
            //   label: 'Next Tab',
            //   accelerator: 'CmdOrCtrl+Right'
            // }, {
            //   label: 'Previous Tab',
            //   accelerator: 'CmdOrCtrl+Left'
          }, {
            type: 'separator'
          }, {
            role: 'front'
          }
        ]
      }, {
        role: 'help',
        submenu: [
          {
            // Placeholder for future features
            //        label: 'Data Curator Help',
            // show accelerator for Windows and Linux only
            //        accelerator: process.platform === 'darwin'
            //          ? ''
            //          : 'F1',
            // hide above
            //        click: function() {
            //          shell.openExternal('https://odiqueensland.github.io/data-curator-help/')
            //        }
            //      }, {
            label: 'Keyboard Shortcuts',
            accelerator: 'CmdOrCtrl+/',
            enabled: true,
            click () {
              showKeyboardHelp()
            }
          }, {
            type: 'separator'
          }, {
            label: 'Support Forum',
            click () {
              shell.openExternal('https://ask.theodi.org.au/c/projects/data-curator')
            }
          }, {
            label: 'Report Issues',
            click () {
              shell.openExternal('https://github.com/ODIQueensland/data-curator/blob/develop/.github/CONTRIBUTING.md')
            }
          }
          // Placeholder for future feature
          //      , {
          //        type: 'separator'
          //      }, {
          //        label: 'Welcome Guide',
          //        enabled: false
          //      }
        ]
      }
    ]
  }

  buildAllMenusForFileFormats () {
    for (const format in fileFormats) {
      this.openSubMenu.push(this.buildMenuForFileFormats(format, openFile, 'CmdOrCtrl+O'))
      this.saveSubMenu.push(this.buildMenuForFileFormats(format, saveFileAs, 'Shift+CmdOrCtrl+S'))
    }
  }

  buildMenuForFileFormats (format, clickFn, csvAccelerator) {
    const option = {
      label: fileFormats[format].label,
      click: ((format => () => {
        clickFn(format)
      })(fileFormats[format]))
    }
    if (format === 'csv') {
      option.accelerator = csvAccelerator
    }
    return option
  }

  buildOpenDataPackageMenu () {
    this.openDataPackageSubMenu = [{
      label: 'zip from URL...',
      enabled: true,
      click () {
        // downloadDataPackageJson()
        showUrlDialog()
      }
    }, {
      label: 'zip from file...',
      enabled: true,
      click () {
        importDataPackage()
      }
    }, {
      label: 'json from URL...',
      enabled: true,
      click () {
        // downloadDataPackageJson()
        showUrlDialog()
      }
    }]
  }

  updateMenuForDarwin () {
    const webContents = this.webContents
    if (process.platform === 'darwin') {
      this.template.unshift({
        label: 'Data Curator',
        submenu: [
          {
            label: 'About Data Curator',
            click: function () {
              webContents().send('showSidePanel', 'about')
            }
          }, {
            type: 'separator'
          }, {
            label: 'Preferences',
            accelerator: 'CmdOrCtrl+,',
            click: function() {
              webContents().send('showSidePanel', 'preferences')
            }
          }, {
            type: 'separator'
          }, {
            role: 'services',
            submenu: []
          }, {
            type: 'separator'
          }, {
            role: 'hide',
            label: 'Hide Data Curator'
          }, {
            role: 'hideothers'
          }, {
            role: 'unhide'
          }, {
            type: 'separator'
          }, {
            role: 'quit',
            label: 'Quit Data Curator'
          }
        ]
      })
    }
  }

  updateMenuForNonDarwin () {
    const webContents = this.webContents
    if (process.platform !== 'darwin') {
      let subTemplate = this.getSubTemplateFromLabel('Window')
      subTemplate.submenu.push({
        type: 'separator'
      }, {
        label: 'About Data Curator',
        click: function () {
          webContents().send('showSidePanel', 'about')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,',
        click: function() {
          webContents().send('showSidePanel', 'preferences', 'settings')
        }
      })
    }
  }

  updateMenuForProduction () {
    if (process.env.NODE_ENV !== 'production') {
      this.template.push({
        label: 'Developer',
        submenu: [
          {
            role: 'reload'
          }, {
            role: 'toggledevtools'
          }
        ]
      })
    }
  }

  getSubTemplateFromLabel (label) {
    return this.template.find(x => x.label === label)
  }

  webContents () {
    // use .fromId rather than .focusedWindow as latter does not apply if app minimized
    // use .fromId rather than .getAllWindows[0] as if child window present and main window minimized won't work
    let browserWindow = focusMainWindow()
    return browserWindow.webContents
  }

  initContainers () {
    this.openSubMenu = []
    this.saveSubMenu = []
  }

  constructor () {
    this.initContainers()
    this.buildAllMenusForFileFormats()
    this.buildOpenDataPackageMenu()
    this.initTemplate()
    this.updateMenuForDarwin()
    this.updateMenuForNonDarwin()
    this.updateMenuForProduction()
    this.menu = Menu.buildFromTemplate(this.template)
  }
}

export function getMenu (menuLabel) {
  let menu = Menu.getApplicationMenu().items.find(x => x.label === menuLabel)
  return menu
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

export function getSubMenuLabelsFromMenu (menuLabel) {
  let menu = getMenu(menuLabel)
  let subMenuLabels = menu.submenu.items.map(x => x.label)
  return subMenuLabels
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
  menu.click()
  let returnLabel = menu.label
  let subMenu
  if (args.length > 1) {
    subMenu = menu.submenu.items.find(x => x.label === args[1])
    subMenu.click()
    returnLabel = subMenu.label
  }
  if (args.length > 2) {
    let subSubMenu = subMenu.submenu.items.find(x => x.label === args[2])
    subSubMenu.click()
    returnLabel = subSubMenu.label
  }
  return returnLabel
}

export {
  AppMenu
}
