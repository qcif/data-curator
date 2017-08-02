var ipc = require('electron').ipcRenderer

export function setActiveTabId(activeTabId) {
  require('electron').remote.getGlobal('sharedObject').activeHotTabId = activeTabId
}

export function getActiveTabId() {
  var activeHotTabId = require('electron').remote.getGlobal('sharedObject').activeHotTabId
  return activeHotTabId
}

export function getActiveHot(hots) {
  console.log('hots are when active...')
  console.log(hots)
  console.log('active tab id: ' + getActiveTabId())
  var activeHot = hots.find(function(container) {
    if (container.guid === getActiveTabId()) {
      return container
    }
  })
  return activeHot
}
