import {openFile, saveFileAs, saveFile, importDataPackage} from './file.js'
import {
  guessColumnProperties,
  createWindowTab,
  validateTable,
  showSidePanel,
  toggleActiveHeaderRow,
  triggerMenuButton
} from './utils.js'
import {importExcel} from './excel.js'
import {showKeyboardHelp} from './help.js'
import {fileFormats} from '../renderer/file-formats.js'
import {shell, BrowserWindow} from 'electron'
// fileActions = require('./file')

// build 'Open...' and 'Save As...' submenus
const open_submenu = []
const save_submenu = []
for (const format in fileFormats) {
  const open_option = {
    label: fileFormats[format].label,
    click: ((format => () => {
      openFile(format)
    })(fileFormats[format]))
  }
  if (format === 'csv') {
    open_option.accelerator = 'CmdOrCtrl+O'
  }
  open_submenu.push(open_option)
  const save_option = {
    label: fileFormats[format].label,
    click: ((format => () => {
      saveFileAs(format)
    })(fileFormats[format]))
  }
  if (format === 'csv') {
    save_option.accelerator = 'Shift+CmdOrCtrl+S'
  }
  save_submenu.push(save_option)
}
// Placeholder for Custom Dialect feature
// open_submenu.push({
//   label: 'Custom Dialect...',
//   enabled: false,
//   click: function() {
//     fileActions.openCustom()
//   }
// })
// save_submenu.push({
//   label: 'Custom Dialect...',
//   enabled: false,
//   click: function() {
//     fileActions.saveAsCustom()
//   }
// })

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click() {
          createWindowTab()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Open',
        submenu: open_submenu
      }, {
        label: 'Open Excel Sheet...',
        enabled: true,
        click() {
          importExcel()
        }
        // Placeholder for future feature
        //      }, {
        //        label: 'Open Google Sheet...',
        //        enabled: false
      }, {
        label: 'Open Data Package...',
        enabled: true,
        click() {
          importDataPackage()
        }
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
      }, {
        // Placeholder for non-macOS Settings for future feature
        type: 'separator'
      }, {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click() {
          saveFile()
        },
        id: 'save',
        enabled: false
      }, {
        label: 'Save As',
        submenu: save_submenu
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
  }, {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('editUndo')
        }
      }, {
        label: 'Redo',
        accelerator: process.platform === 'darwin'
          ? 'Shift+CmdOrCtrl+Z'
          : 'CmdOrCtrl+Y',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('editRedo')
        }
      },
      {
        type: 'separator'
      },
      // electron roles for copy/cut/paste seem to be more reliable than equivalent for hot
      {
        role: 'cut',
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X'
      },
      {
        role: 'copy',
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C'
      },
      {
        role: 'paste',
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V'
      },
      // {
      //   // turned off for Beta release
      //   // role: 'selectall',
      //   label: 'Select All',
      //   enabled: false,
      //   accelerator: 'CmdOrCtrl+A'
      // },
      {
        type: 'separator'
      },
      {
        label: 'Insert Row Above',
        accelerator: 'CmdOrCtrl+I',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('insertRowAbove')
        }
      }, {
        label: 'Insert Row Below',
        accelerator: 'CmdOrCtrl+K',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('insertRowBelow')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Insert Column Before',
        accelerator: 'CmdOrCtrl+J',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('insertColumnLeft')
        }
      }, {
        label: 'Insert Column After',
        accelerator: 'CmdOrCtrl+L',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('insertColumnRight')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Remove Row(s)',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('removeRows')
        }
      }, {
        label: 'Remove Column(s)',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('removeColumns')
        }
      }
    ]
  }, {
    // Placeholder for future features
    //    label: 'Find',
    //    submenu: [
    //      {
    //        label: 'Find',
    //        accelerator: 'CmdOrCtrl+F',
    //        enabled: false
    //      }, {
    //        label: 'Find Next',
    //        accelerator: 'CmdOrCtrl+G',
    //        enabled: false
    //      }, {
    //        label: 'Find Previous',
    //        accelerator: 'Shift+CmdOrCtrl+G',
    //        enabled: false
    //      }, {
    //        type: 'separator'
    //      }, {
    //        label: 'Replace',
    //        accelerator: 'Alt+CmdOrCtrl+F',
    //        enabled: false
    //      }, {
    //        label: 'Replace Next',
    //        accelerator: 'Alt+CmdOrCtrl+E',
    //        enabled: false
    //      }, {
    //        label: 'Replace All',
    //        enabled: false
    //      }
    //    ]
    //  }, {
    label: 'Tools',
    submenu: [
      {
        label: 'Header Row',
        type: 'checkbox',
        checked: false,
        click(menuItem) {
          // revert 'checked' toggle so only controlled by header row event
          menuItem.checked = !menuItem.checked
          toggleActiveHeaderRow()
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
        click: function() {
          guessColumnProperties()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Validate Table',
        accelerator: 'Shift+CmdOrCtrl+V',
        click() {
          validateTable()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Set Column Properties',
        click() {
          triggerMenuButton('Column')
        }
      }, {
        label: 'Set Table Properties',
        click() {
          triggerMenuButton('Table')
        }
      }, {
        label: 'Set Provenance Information',
        click() {
          triggerMenuButton('Provenance')
        }
      }, {
        label: 'Set Data Package Properties',
        click() {
          triggerMenuButton('Package')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Export Data Package...',
        accelerator: 'CmdOrCtrl+D',
        click() {
          triggerMenuButton('Export')
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
  }, {
    label: 'Window',
    submenu: [
      {
        role: 'minimize'
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
        role: 'quit'
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
        click() {
          showKeyboardHelp()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Support Forum',
        click() {
          shell.openExternal('https://ask.theodi.org.au/c/projects/data-curator')
        }
      }, {
        label: 'Report Issues',
        click() {
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

// Tailor menu for Windows - add About to Help menu if (process.platform !== 'darwin') {
template[4].submenu.push({
  type: 'separator'
}, {
  label: 'About Data Curator',
  click: function() {
    showSidePanel('about')
  }
})

// Tailor menu for macOS
if (process.platform === 'darwin') {
  template.unshift({
    label: 'Data Curator',
    submenu: [
      {
        label: 'About Data Curator',
        click: function() {
          showSidePanel('about')
        }
      // Placeholder for future feature
      //      }, {
      //        type: 'separator'
      //      }, {
      //        label: 'Preferences'
      //        accelerator: 'CmdOrCtrl+,',
      //        click: function() {
      //          showSidePanel('preferences')
      //        }
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

  // overwrite Window menu
  template[4].submenu = [
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
}

// Add developer tools menu to end if not in production environment
if (process.env.NODE_ENV !== 'production') {
  template.push({
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

export {
  template as menu
}
