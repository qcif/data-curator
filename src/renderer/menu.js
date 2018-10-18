import { insertRowAbove, insertRowBelow, insertColumnLeft, insertColumnRight, removeRows, removeColumns } from '@/hot.js'
import { remote } from 'electron'
const Menu = remote.Menu
const MenuItem = remote.MenuItem

var menu = new Menu()

var rowAbove = new MenuItem({
  label: 'Insert row above',
  click: function() {
    insertRowAbove()
  }
})

var rowBelow = new MenuItem({
  label: 'Insert row below',
  click: function() {
    insertRowBelow()
  }
})

var columnLeft = new MenuItem({
  label: 'Insert column before',
  click: function() {
    insertColumnLeft()
  }
})

var columnRight = new MenuItem({
  label: 'Insert column after',
  click: function() {
    insertColumnRight()
  }
})

var removeRow = new MenuItem({
  label: 'Remove row(s)',
  click: function() {
    removeRows()
  }
})

var removeCol = new MenuItem({
  label: 'Remove column(s)',
  click: function() {
    removeColumns()
  }
})

menu.append(new MenuItem({ type: 'separator' }))
menu.append(rowAbove)
menu.append(rowBelow)
menu.append(new MenuItem({ type: 'separator' }))
menu.append(columnLeft)
menu.append(columnRight)
menu.append(new MenuItem({ type: 'separator' }))
menu.append(removeRow)
menu.append(removeCol)

export {
  menu
}
