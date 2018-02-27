import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before} from 'cucumber'
import fakeMenu from 'spectron-fake-menu'
const _ = require('lodash')

Before({timeout: 10000}, function () {
  fakeMenu.apply(this.app)
  this.fakeMenu = fakeMenu
})

When(/^I click on the ([\w]+?) menu/, function (menuLabel) {
  return this.app
    .client.waitUntilWindowLoaded()
    .getWindowCount().should.eventually.have.at.least(1)
    .electron
    .Menu
    .getApplicationMenu()
    .then(function(menu) {
      console.log('entered menu')
      // let menu1 = getMenuFromLabel(menu, menuLabel)
      // let submenu = getSubMenuFromMenu(menu1, subMenuLabels)
      // submenu.click()
    })
})

function getMenuFromLabel(menu, menuLabel) {
  return menu.items.find(function(x) { x.label === menuLabel })
}

function getSubMenuFromMenu(menu, subMenuLabel) {
  return menu.submenu.items.find(function(x) { x.label === subMenuLabel })
}
