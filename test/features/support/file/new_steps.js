import { expect, should, assert } from 'chai'
import { Given, When, Then} from 'cucumber'

When(/^I have opened Data Curator$/, function () {
  return this
    .app
    .client
    .waitUntilWindowLoaded()
    .getTitle()
    .then(title => {
      expect(title).to.equal('Data Curator')
    })
})

Then(/^I should see 1 window opened$/, function () {
  return this.app.client.waitUntilWindowLoaded()
    .getWindowCount()
    .then(count => {
      expect(count).to.equal(1)
    })
})

Then(/^The window should have 1 tab opened$/, function () {
  return this.app.client
    .waitForVisible('#csvEditor')
    .elements('.tab-header')
    .then(response => {
      expect(response.value.length).to.equal(1)
    })
})

Then(/^The tab should have 1 table$/, function () {
  return this.app.client
    .waitForVisible('#csvEditor')
    .elements('.tab-content')
    .then(response => {
      expect(response.value.length).to.equal(1)
    })
    .elements('.editor.handsontable')
    .then(response => {
      expect(response.value.length).to.equal(1)
    })
})

Then(/^The table should have 1 row by 3 columns$/, function () {
  return this.app.client.element('.editor.handsontable')
    .getText('.ht_master table tr td')
    .then(array => {
      expect(array).to.deep.equal(['', '', ''])
    })
})

Then(/^The table should be empty$/, function () {
  return this.app.client.element('.editor.handsontable')
    .getText('.ht_master table tr td')
    .then(array => {
      let text = array.join('')
      expect(text).to.equal('')
    })

  Then(/^The cursor should be in row {int}, column {int}$/, function (int, int2) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending')
    // var currentState = this.app
    // this.app.electron.ipcMain.on('currentCellSelection-message', (event, arg) => {
    //   currentState.client.
    // })
    // return this.app.webContents
    //   .send('getCurrentCellSelection')
    //   .then( ()=> {
    //
    //   })
  })

// BrowserWindow.getFocusedWindow().webContents.send('toggleActiveHeaderRow')
//     ipc.on('currentCellSelectione', function() {
//       let activeHot = HotRegister.getActiveInstance()
//       let currentCell = activeHot.getSelected()
//       ipc.send('currentCellSelection', currentCell)
})
