import { insertRowAbove, insertRowBelow, insertColumnBefore, insertColumnAfter, removeRows, removeColumns } from '@/hot.js'
import { remote } from 'electron'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

const sharedMenus = {
  insertRowAbove: {
    label: 'Insert Row Above',
    accelerator: 'CmdOrCtrl+I'
  },
  insertRowBelow: {
    label: 'Insert Row Below',
    accelerator: 'CmdOrCtrl+K'
  },
  insertColumnBefore: {
    label: 'Insert Column Before',
    accelerator: 'CmdOrCtrl+J'
  },
  insertColumnAfter: {
    label: 'Insert Column After',
    accelerator: 'CmdOrCtrl+L'
  },
  removeRows: {
    label: 'Remove Row(s)'
  },
  removeColumns: {
    label: 'Remove Column(s)'
  }
}

let menu = new Menu()

let rowAbove = new MenuItem({
  label: sharedMenus.insertRowAbove.label,
  accelerator: sharedMenus.insertRowAbove.accelerator,
  click: function() {
    insertRowAbove()
  }
})

let rowBelow = new MenuItem({
  label: sharedMenus.insertRowBelow.label,
  accelerator: sharedMenus.insertRowBelow.accelerator,
  click: function() {
    insertRowBelow()
  }
})

let columnBefore = new MenuItem({
  label: sharedMenus.insertColumnBefore.label,
  accelerator: sharedMenus.insertColumnBefore.accelerator,
  lockable: true,
  click: function() {
    insertColumnBefore()
  }
})

let columnAfter = new MenuItem({
  label: sharedMenus.insertColumnAfter.label,
  accelerator: sharedMenus.insertColumnAfter.accelerator,
  click: function() {
    insertColumnAfter()
  }
})

let removeRow = new MenuItem({
  label: sharedMenus.removeRows.label,
  click: function() {
    removeRows()
  }
})

let removeCol = new MenuItem({
  label: sharedMenus.removeColumns.label,
  click: function() {
    removeColumns()
  }
})

menu.append(new MenuItem({ type: 'separator' }))
menu.append(rowAbove)
menu.append(rowBelow)
menu.append(new MenuItem({ type: 'separator' }))
menu.append(columnBefore)
menu.append(columnAfter)
menu.append(new MenuItem({ type: 'separator' }))
menu.append(removeRow)
menu.append(removeCol)

export {
  menu, sharedMenus
}
