import { expect, should, assert } from 'chai'
import { Given, When, Then} from 'cucumber'
const _ = require('lodash')

When(/^I click on the ([\w]+?)->([\w]+?) menu/, function (menuLabel, subMenuLabels) {
  return this.app.electron
    .remote
    .Menu
    .getApplicationMenu()
    .then(function(menu) {
      let menu1 = getMenuFromLabel(menu, menuLabel)
      let submenu = getSubMenuFromMenu(menu1, subMenuLabels)
      submenu.click()
    })
})

function getMenuFromLabel(menu, menuLabel) {
  return menu.items.find(x => x.label === menuLabel)
}

function getSubMenuFromMenu(menu, subMenuLabel) {
  return menu.submenu.items.find(x => x.label === subMenuLabel)
}
