import {openFile, saveFileAs, saveFile} from './file.js'
// import {fileFormats} from '../renderer/file-formats.js'
import {fileFormats} from '../renderer/file-formats.js'
import {shell} from 'electron'
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
          utils.createWindowTab()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Open',
        submenu: open_submenu
      }, {
        label: 'Open Excel Sheet...',
        enabled: false,
        click() {
          excel.importExcel()
        }
        // Placeholder for future feature
        //      }, {
        //        label: 'Open Google Sheet...',
        //        enabled: false
      }, {
        label: 'Open Data Package...',
        // turned off for Beta release
        enabled: false
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
      }, {
        type: 'separator'
      }, {
        label: 'Close Tab',
        accelerator: 'CmdOrCtrl+W',
        // turned off for Beta release
        enabled: false
      }
      // Placeholder for future features
      //,     {
      //        type: 'separator'
      //      }, {
      //        label: 'Print',
      //        accelerator: 'CmdOrCtrl+P',
      //        enabled: false
      //      }
    ]
  }, {
    label: 'Edit',
    submenu: [
      {
        // role: 'undo',
        // turned off for Beta release
        label: 'Undo',
        enabled: false,
        accelerator: 'CmdOrCtrl+Z'
      }, {
        // role: 'redo',
        // turned off for Beta release
        label: 'Redo',
        enabled: false,
        accelerator: process.platform === 'darwin'
          ? 'Shift+CmdOrCtrl+Z'
          : 'CmdOrCtrl+Y'
      }, {
        type: 'separator'
      }, {
        // role: 'cut',
        // turned off for Beta release
        label: 'Cut',
        enabled: false,
        accelerator: 'CmdOrCtrl+X'
      }, {
        role: 'copy',
        // turned off for Beta release
        // label: 'Copy',
        // enabled: true,
        // accelerator: 'CmdOrCtrl+C',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('editCopy')
        }
      }, {
        role: 'paste',
        // turned off for Beta release
        // label: 'Paste',
        // enabled: true,
        // accelerator: 'CmdOrCtrl+V',
        click() {
          BrowserWindow.getFocusedWindow().webContents.send('editPaste')
        }
      }, {
        // turned off for Beta release
        // role: 'selectall',
        label: 'Select All',
        enabled: false,
        accelerator: 'CmdOrCtrl+A'
      }, {
        type: 'separator'
      }, {
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
    //    label: 'View',
    //    submenu: [
    //      {
    //        label: 'Read Only',
    //        type: 'checkbox',
    //        checked: true,
    //        enabled: false
    //      }, {
    // TO DO: hide toggledevtools in production release and make a application shortcut
    //        role: 'toggledevtools'
    //      }, {
    //        type: 'separator'
    //      }, {
    //        role: 'togglefullscreen'
    //      }
    //    ]
    //  }, {
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
        //        label: 'Create Look-up Table from Column',
        //        enabled: false
        // }, {
        //  type: 'separator'
        // }, {
        label: 'Guess Column Properties',
        click: function() {
          utils.guessColumnProperties()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Validate Table',
        accelerator: 'Shift+CmdOrCtrl+V',
        click() {
          utils.validateTable()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Set Column Properties'
      }, {
        label: 'Set Table Properties'
      }, {
        // Placeholder for future features
        //        label: 'Set View Properties',
        //        enabled: false
        //       , icon: '/static/img/locked.svg'
        //      }, {
        label: 'Set Provenance Information'
      }, {
        // Placeholder for future features
        //        label: 'Generate Data Quality Information',
        //        enabled: false
        //       , icon: '/static/img/locked.svg'
        //      }, {
        label: 'Set Data Package Properties'
      }, {
        type: 'separator'
      }, {
        // TO DO: Conditionally enabled based on required properties being set and no changes since last successful validation
        label: 'Export Data Package...',
        accelerator: 'CmdOrCtrl+D',
        // turned off for Beta release
        enabled: false
        //        click: function() {
        //          datapackage.exportdata()
        //        }
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
      }, {
        type: 'separator'
      }, {
        label: 'Next Tab',
        accelerator: 'CmdOrCtrl+Right',
        // turned off for Beta release
        enabled: false
      }, {
        label: 'Previous Tab',
        accelerator: 'CmdOrCtrl+Left',
        // turned off for Beta release
        enabled: false
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
        enabled: false,
        click() {
          help.showKeyboardHelp()
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

// Tailor menu for Windows - add About to Help menu
if (process.platform !== 'darwin') {
  template[4].submenu.push(
    {
      type: 'separator'
    }, {
      label: 'About Data Curator',
      click: function() {
        utils.showSidePanel('about')
      }
    }
  )
}

// Tailor menu for macOS
if (process.platform === 'darwin') {
  template.unshift(
    {
      label: 'Data Curator',
      submenu: [
        {
          label: 'About Data Curator',
          click: function() {
            utils.showSidePanel('about')
          }
          // Placeholder for future feature
          //      }, {
          //        type: 'separator'
          //      }, {
          //        label: 'Preferences'
          //        accelerator: 'CmdOrCtrl+,',
          //        click: function() {
          //          utils.showSidePanel('preferences')
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
    }
  )

  // overwrite Window menu
  template[4].submenu = [
    {
      role: 'minimize'
    }, {
      role: 'zoom'
    }, {
      type: 'separator'
    }, {
      label: 'Next Tab',
      accelerator: 'CmdOrCtrl+Right',
      // turned off for Beta release
      enabled: false
    }, {
      label: 'Previous Tab',
      accelerator: 'CmdOrCtrl+Left',
      // turned off for Beta release
      enabled: false
    }, {
      type: 'separator'
    }, {
      role: 'front'
    }
  ]
}

// Add developer tools menu to end if not in production environment
if (process.env.NODE_ENV !== 'production') {
  template.push(
    {
      label: 'Developer',
      submenu: [
        {
          role: 'reload'
        }, {
          role: 'toggledevtools'
        }
      ]
    }
  )
}

export {
  template as menu
}
