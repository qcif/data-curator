import { Then } from 'cucumber'
import { waitForVisibleIdFromLabel } from '../page-objects/selectors.js'

Then(/^the "([\w ]+?)" panel should be displayed/, { timeout: -1 }, async function (panelName) {
  await waitForVisibleIdFromLabel(this.app, '#sidenav', panelName, this.pageTimeout)
})
