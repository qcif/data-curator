import { openFile, saveFileAs, saveFile, importDataPackageFromFile, importTableResourceSchemaFromFile } from './file.js'
import { showUrlDialogForPackage, showUrlDialogForResourceSchema } from './url.js'
import { createWindowTab, focusMainWindow } from './windows.js'
import { importExcel } from './excel.js'
import { showKeyboardHelp } from './help.js'
import { sharedMenus, fileFormats } from '../renderer/sharedWithMain.js'
import { shell, Menu } from 'electron'
import _ from 'lodash'

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
            label: 'Import Column Properties',
            submenu: [
              {
                label: 'json from URL...',
                click () {
                  showUrlDialogForResourceSchema()
                }
              },
              {
                label: 'json from file...',
                click () {
                  importTableResourceSchemaFromFile()
                }
              }
            ]
          }, {
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
          {
            type: 'separator'
          },
          _.assign({}, sharedMenus.insertRowAbove, { click () { webContents().send('insertRowAbove') } }),
          _.assign({}, sharedMenus.insertRowBelow, { click () { webContents().send('insertRowBelow') } }),
          {
            type: 'separator'
          },
          _.assign({}, sharedMenus.insertColumnBefore, { click () { webContents().send('insertColumnBefore') } }),
          _.assign({}, sharedMenus.insertColumnAfter, { click () { webContents().send('insertColumnAfter') } }),
          {
            type: 'separator'
          },
          _.assign({}, sharedMenus.removeRows, { click () { webContents().send('removeRows') } }),
          _.assign({}, sharedMenus.removeColumns, { click () { webContents().send('removeColumns') } })
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
            // clash with mac hotkeys
            // accelerator: 'Alt+CmdOrCtrl+G',
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
            // consistency with find previous
            // accelerator: 'Alt+CmdOrCtrl+E',
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
          },
          {
            label: 'Guess Column Properties',
            accelerator: 'Shift+CmdOrCtrl+G',
            lockable: true,
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
            label: 'Lock Table Schema',
            accelerator: 'Shift+CmdOrCtrl+L',
            type: 'checkbox',
            checked: false,
            click (menuItem) {
              // revert 'checked' toggle so only controlled by event
              menuItem.checked = !menuItem.checked
              webContents().send('toggleLockTableSchema')
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
        ]
      }, {
        label: 'Window',
        submenu: [
          {
            role: 'minimize'
          }, {
            role: 'zoom'
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
            label: 'Keyboard Shortcuts',
            accelerator: 'CmdOrCtrl+/',
            enabled: true,
            click () {
              showKeyboardHelp()
            }
          }, {
            type: 'separator'
          }, {
            label: 'Data Curator Help',
            click () {
              shell.openExternal('https://odiqueensland.github.io/data-curator-help')
            }
          }, {
            label: 'Report Issues',
            click () {
              shell.openExternal('https://github.com/ODIQueensland/data-curator/blob/develop/.github/CONTRIBUTING.md')
            }
          }
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
        showUrlDialogForPackage()
      }
    }, {
      label: 'zip from file...',
      enabled: true,
      click () {
        importDataPackageFromFile()
      }
    }, {
      label: 'json from URL...',
      enabled: true,
      click () {
        showUrlDialogForPackage()
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
            click: function () {
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
        click: function () {
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

export {
  AppMenu
}
