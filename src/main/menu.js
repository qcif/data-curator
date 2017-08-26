var file_formats = require('../renderer/file-actions.js').formats
const {shell} = require('electron')

// build 'Open..' and 'Save As..' submenus
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
open_submenu.push({
  label: 'Custom',
  click: function() {
    fileActions.openCustom()
  }
})
save_submenu.push({
  label: 'Custom',
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
          utils.showAboutPanel()
        }
      },
      {
        label: 'Check for Update',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Preferences',
        accelerator: 'CmdOrCtrl+,',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Data Curator',
        accelerator: 'CmdOrCtrl+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: 'CmdOrCtrl+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit Data Curator',
        accelerator: 'CmdOrCtrl+Q',
        selector: 'terminate:'
      }
    ]
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click: function() {
          utils.createWindowTab()
        }
      },
//      {
//        label: 'New from Schema...',
//        click: function() {
//          schema.generateTemplate()
//        }
//      },
      {
        type: 'separator'
      },
      {
        label: 'Open separated value file...',
        submenu: open_submenu
      },
      {
        label: 'Open Excel file...',
        click: function() {
          excel.importExcel()
        }
      },
      {
        label: 'Open Data Package...',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: function() {
          fileActions.saveFile()
        },
        id: 'save'
      },
      {
        label: 'Save As...',
        submenu: save_submenu
      },
      {
        label: 'Save All',
        accelerator: 'Alt+CmdOrCtrl+S',
        enabled: false
      },
      {
        label: 'Export Data Package...',
        enabled: false
//        accelerator: 'CmdOrCtrl+D',
//        click: function() {
//          datapackage.exportdata()
//        }
      }
//      {
//        label: 'Github',
//        submenu: [
//          {
//            label: 'Export to Github',
//            accelerator: 'CmdOrCtrl+G',
//            click: function() {
//              github.exportToGithub()
//            }
//          },
//          {
//            label: 'Add file to Github',
//            accelerator: 'CmdOrCtrl+Shift+G',
//            click: function() {
//              github.addFileToGithub()
//            }
//          }
//        ]
//      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('editUndo')
        }
      },
      {
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Y',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('editRedo')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('editCut')
        }
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('editCopy')
        }
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('editPaste')
        }
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('editSelectAll')
        }
      },
      {
        type: 'separator'
      },
//      {
//        label: 'Freeze Header Row',
//        click: function() {
//          BrowserWindow.getFocusedWindow().webContents.send('freeze')
//        }
//      },
//      {
//        label: 'Unfreeze Header Row',
//        click: function() {
//          BrowserWindow.getFocusedWindow().webContents.send('unfreeze')
//        }
//      },
//      {
//        type: 'separator'
//      },
      {
        label: 'Insert row above',
        accelerator: 'CmdOrCtrl+I',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('insertRowAbove')
        }
      },
      {
        label: 'Insert row below',
        accelerator: 'CmdOrCtrl+K',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('insertRowBelow')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Insert column left',
        accelerator: 'CmdOrCtrl+J',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('insertColumnLeft')
        }
      },
      {
        label: 'Insert column right',
        accelerator: 'CmdOrCtrl+L',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('insertColumnRight')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Remove row(s)',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('removeRows')
        }
      },
      {
        label: 'Remove column(s)',
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.send('removeColumns')
        }
      }
    ]
  },
  {
    label: 'Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: function() {
          BrowserWindow.getFocusedWindow().toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Fix Ragged Rows',
        enabled: false
//        click: function() {
//          tools.fixRaggedRowsFile()
//        }
      },
//      {
//        label: 'Generate Header',
//        click: function() {
//          tools.generateSchemaFromHeader()
//        }
//      },
      {
        label: 'Validate',
        accelerator: 'Shift+CmdOrCtrl+V',
        enabled: false
//        click: function() {
//          validate.validateFile()
//        }
      },
      {
        type: 'separator'
      },
//      {
//        label: 'Validate with schema',
//        click: function() {
//          validate.validateWithSchema()
//        }
//      },
      {
        label: 'Column Properties',
        enabled: false
      },
      {
        label: 'Table Properties',
        enabled: false
      },
      {
        label: 'Provenance Information',
        enabled: false
      },
      {
        label: 'Data Package Properties',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Publish to CKAN',
        enabled: false
      }
    ]
  },
  {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        selector: 'performMiniaturize:'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        selector: 'performClose:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Next Tab',
        enabled: false,
        accelerator: 'CmdOrCtrl+Right'
      },
      {
        label: 'Previous Tab',
        enabled: false,
        accelerator: 'CmdOrCtrl+Left'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Data Curator Help',
        click: function() {
          shell.openExternal('https://odiqueensland.github.io/data-curator-help/')
        }
      },
      {
        label: 'Support',
        click: function() {
          shell.openExternal('https://ask.theodi.org.au/c/projects/data-curator')
        }
      },
      {
        label: 'Keyboard Shortcuts',
        click: function() {
          help.showKeyboardHelp()
        }
      }
    ]
  }
]
