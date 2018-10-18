import { When, Then } from 'cucumber'
import { applyFnToIdOrClassSelectorFromLabel } from '../page-objects/selectors.js'
const highlightColor = 'rgba(181,209,255,0.3)'

Then(/^the column that the cursor is in should be displayed/, async function () {
  let found = false
  const selector = '.editor.handsontable'
  let responses
  responses = await this.app.client.element(selector).getCssProperty('.ht_master table tr td', 'backgroundColor')
  for (const next of responses) {
    if (next.value === highlightColor) {
      found = true
    }
  }
  if (!found) {
    console.log('Unable to find matching background color, trying class...')
    responses = await this.app.client.waitForVisible('.current.highlight')
  }
  return responses
})

When(/^(?:the )?"([\w ]+?)" (?:button|panel) is (?:clicked|invoked)$/, async function (label) {
  await applyFnToIdOrClassSelectorFromLabel(this.app, 'click', label, this.pageTimeout)
})
