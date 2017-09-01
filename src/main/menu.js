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

  // label should have ... appended to end
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
open_submenu.push({
  label: 'Custom Dialect...',
  enabled: false,
  click: function() {
    fileActions.openCustom()
  }
})
save_submenu.push({
  label: 'Custom Dialect...',
  enabled: false,
  click: function() {
    fileActions.saveAsCustom()
  }
})

exports.menu = [
  {
    label: 'Data Curator',
    submenu: [
      {
        label: 'About Data Curator',
        click: function() {
          utils.showSidePanel('about')
        }
      }, {
        label: 'Check for Update',
        enabled: false
      }, {
        type: 'separator'
      }, {
        label: process.platform === 'darwin'
          ? 'Preferences'
          : 'Settings',
        accelerator: 'CmdOrCtrl+,',
        enabled: true,
        click: function() {
          utils.showSidePanel('preferences')
        }
      }, {
        type: 'separator'
      }, {
// hide below in Windows and Linux
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        role: 'hide'
      }, {
        role: 'hideothers'
      }, {
        role: 'unhide'
      }, {
        type: 'separator'
// hide above
      }, {
        role: 'quit'
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
      }, {
        label: 'Open Google Sheet...',
        enabled: false
      }, {
        label: 'Open Data Package...'
      }, {
        label: 'Open Recent',
        submenu: [
          {
            label: 'example.csv',
            enabled: false
          }, {
            type: 'separator'
          }, {
            label: 'Clear Menu',
            enabled: false
          }
        ]
      }, {
        type: 'separator'
      }, {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: function() {
          fileActions.saveFile()
        },
        id: 'save'
      }, {
        label: 'Save As',
        submenu: save_submenu
      }, {
        label: 'Save All',
        accelerator: 'Alt+CmdOrCtrl+S',
        enabled: false
      }, {
        type: 'separator'
      }, {
        label: 'Close Tab',
        accelerator: 'CmdOrCtrl+W'
      }, {
        label: 'Close All',
        enabled: false
      }, {
        type: 'separator'
      }, {
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        enabled: false
      }
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
        label: 'Insert Column Left',
        accelerator: 'CmdOrCtrl+J',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('insertColumnLeft')
        }
      }, {
        label: 'Insert Column Right',
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
    label: 'View',
    submenu: [
      {
        label: 'Read Only',
        type: 'checkbox',
        checked: true,
        enabled: false
      }, {
// hide below in build or invoke using hidden shortcut
        role: 'toggledevtools'
      }, {
// hide above
        type: 'separator'
      }, {
        role: 'togglefullscreen'
      }
    ]
  }, {
    label: 'Find',
    submenu: [
      {
        label: 'Find',
        accelerator: 'CmdOrCtrl+F',
        enabled: false
      }, {
        label: 'Find Next',
        accelerator: 'CmdOrCtrl+G',
        enabled: false
      }, {
        label: 'Find Previous',
        accelerator: 'Shift+CmdOrCtrl+G',
        enabled: false
      }, {
        type: 'separator'
      }, {
        label: 'Replace',
        accelerator: 'Alt+CmdOrCtrl+F',
        enabled: false
      }, {
        label: 'Replace Next',
        accelerator: 'Alt+CmdOrCtrl+E',
        enabled: false
      }, {
        label: 'Replace All',
        enabled: false
      }, {
        type: 'separator'
      }, {
        label: 'Sort',
        accelerator: 'Shift+CmdOrCtrl+R',
        enabled: false
      }, {
        label: 'Filter',
        enabled: false
      }
    ]
  }, {
    label: 'Tools',
    submenu: [
      {
        label: 'Fix Ragged Rows',
        click: function() {
          tools.fixRaggedRowsFile()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Guess Column Properties'
      }, {
        label: 'Import Column Properties...',
        enabled: false
      }, {
        type: 'separator'
      }, {
        label: 'Create Constraint from Column',
        enabled: false
      }, {
        label: 'Create Look-up Table from Column',
        enabled: false
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
        label: 'Column Properties'
      }, {
        label: 'Table Properties'
      }, {
        label: 'View Properties',
        enabled: false
//       , icon: '/static/img/locked.svg'
      }, {
        label: 'Provenance Information'
      }, {
        label: 'Data Quality Information',
        enabled: false
//       , icon: '/static/img/locked.svg'
      }, {
        label: 'Data Package Properties'
      }, {
        type: 'separator'
      }, {
        label: 'Export Data Package...',
        accelerator: 'CmdOrCtrl+D',
        click: function() {
          datapackage.exportdata()
        }
      }, {
        label: 'Publish Data Package to',
        enabled: false,
        submenu: [
          {
            label: 'CKAN',
            enabled: false
//          , icon: '/static/img/locked.svg'
          }, {
            label: 'DataHub',
            enabled: false
//          , icon: '/static/img/locked.svg'
          }, {
            label: 'OctoPub',
            enabled: false
//          , icon: '/static/img/locked.svg'
          }
        ]
      }
    ]
  }, {
    label: 'Window',
    submenu: [
// hide below in Windows and Linux
      {
        role: 'minimize'
      }, {
        role: 'zoom'
      }, {
        type: 'separator'
// hide above
      }, {
        label: 'Next Tab',
        enabled: false,
        accelerator: 'CmdOrCtrl+Right'
      }, {
        label: 'Previous Tab',
        enabled: false,
        accelerator: 'CmdOrCtrl+Left'
      }, {
// hide below in Windows and Linux
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
        label: 'Data Curator Help',
// show accelerator for Windows and Linux only
        accelerator: process.platform === 'darwin'
          ? ''
          : 'F1',
// hide above
        click: function() {
          shell.openExternal('https://odiqueensland.github.io/data-curator-help/')
        }
      }, {
        label: 'Keyboard Shortcuts',
        accelerator: 'CmdOrCtrl+/',
        click: function() {
          help.showKeyboardHelp()
        }
      }, {
        type: 'separator'
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
      }, {
        type: 'separator'
      }, {
        label: 'Welcome Guide',
        enabled: false
      }
    ]
  }
]
