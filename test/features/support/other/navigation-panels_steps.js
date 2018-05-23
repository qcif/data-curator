import { expect, should, assert } from 'chai'
import { Given, When, Then, After, Before } from 'cucumber'
import {waitForVisibleIdFromLabel} from '../page-objects/selectors.js'

Then(/^the "([\w ]+?)" panel should be displayed/, {timeout: -1}, async function (panelName) {
  let result = await waitForVisibleIdFromLabel(this.app, '#sidenav', panelName, this.pageTimeout)
})
