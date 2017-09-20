var file_formats = require('../renderer/file-actions.js').formats
const {shell} = require('electron')

// build 'Open...' and 'Save As...' submenus
var open_submenu = []
var save_submenu = []
for (var format in file_formats) {
  var open_option = {
    label: file_formats[format].label,
    click: (function(format) {
      return function() {
        fileActions.openFile(format)
      }
    }(file_formats[format]))
  }
  if (format === 'csv') {
    open_option.accelerator = 'CmdOrCtrl+O'
  }
  open_submenu.push(open_option)
  var save_option = {
    label: file_formats[format].label,
    click: (function(format) {
      return function() {
        fileActions.saveFileAs(format)
      }
    }(file_formats[format]))
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

exports.menu = [
  {
    // Only show the Data Curator menu for macOS.
    // TO DO: add test for macOS...
    label: 'Data Curator',
    submenu: [
      {
        label: 'About Data Curator',
        click: function() {
          utils.showSidePanel('about')
        }
        // Placeholder for future feature
        //      }, {
        //        label: 'Check for Update',
        //        enabled: false
        //      }, {
        //        type: 'separator'
        //      }, {
        //        label: process.platform === 'darwin'
        //          ? 'Preferences'
        //          : 'Settings',
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
  }, {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click: function() {
          utils.createWindowTab()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Open',
        submenu: open_submenu
      }, {
        label: 'Open Excel Sheet...',
        click: function() {
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
        click: function() {
          fileActions.saveFile()
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
      //, {
      //        label: 'Close All'
      //      }, {
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
        role: 'undo'
      }, {
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        role: 'cut'
      }, {
        role: 'copy'
      }, {
        role: 'paste'
      }, {
        role: 'selectall'
      }, {
        type: 'separator'
      }, {
        label: 'Insert Row Above',
        accelerator: 'CmdOrCtrl+I',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('insertRowAbove')
        }
      }, {
        label: 'Insert Row Below',
        accelerator: 'CmdOrCtrl+K',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('insertRowBelow')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Insert Column Before',
        accelerator: 'CmdOrCtrl+J',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('insertColumnLeft')
        }
      }, {
        label: 'Insert Column After',
        accelerator: 'CmdOrCtrl+L',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('insertColumnRight')
        }
      }, {
        type: 'separator'
      }, {
        label: 'Remove Row(s)',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('removeRows')
        }
      }, {
        label: 'Remove Column(s)',
        click: function() {
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
        // TO DO: hide toggledevtools in production release and make a application shortcut
        role: 'toggledevtools'
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
      }, {
        type: 'separator'
      }, {
        label: 'Validate Table',
        accelerator: 'Shift+CmdOrCtrl+V',
        click: function() {
          validate.validateFile()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Guess Column Properties',
        click: function() {
          utils.guessColumnProperties()
        }
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
    // TO DO: Update this menu if Data Curator is a multi window app
    label: 'Window',
    submenu: [
      // TO DO: hide below in Windows and Linux
      {
        role: 'minimize'
      }, {
        role: 'zoom'
      }, {
        type: 'separator'
        // hide above
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
        // TO DO: hide below in Windows and Linux
        type: 'separator'
      }, {
        role: 'front'
      }
      // hide above
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
        click: function() {
          help.showKeyboardHelp()
        }
      }, {
        type: 'separator'
        // Placeholder for Windows/Linux 'Check for Updates' future feature
      }, {
        label: 'Support Forum',
        click: function() {
          shell.openExternal('https://ask.theodi.org.au/c/projects/data-curator')
        }
      }, {
        label: 'Report Issues',
        click: function() {
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
