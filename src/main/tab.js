const _ = require('lodash')

export function getActiveTabTitle() {
  let hotId = global.hot.activeId
  console.log(`hot id is ${hotId}`)
  console.log(state)
  let tabId = state.hotTabs
  console.log(`tab id is ${tabId}`)
  // let tabTitle = tabStore.getters.tabTitle(tabId)
  // console.log(`tab title is: ${tabTitle}`)
  return 'tabTitle'
}
