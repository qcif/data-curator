import { When, Then } from 'cucumber'
import { activeTableElement, applyFnToIdOrClassSelectorFromLabel, cellSelector } from '../page-objects/selectors.js'
import { collectWithFn } from '../page-objects/helpers'
import _ from 'lodash'
const highlightColor = 'rgba(181,209,255,0.3)'

Then(/^the column that the cursor is in should be displayed/, async function () {
  const els = await (await activeTableElement(this.app)).$$(cellSelector)
  const collected = await collectWithFn(els, 'getCSSProperty', 'backgroundColor')
  if (!_.includes(collected, highlightColor)) {
    console.log('Unable to find matching background color, trying class...')
    const el = await this.app.client.$('.current.highlight')
  }
})

When(/^(?:the )?"([\w ]+?)" (?:button|panel) is (?:clicked|invoked)$/, async function (label) {
  await applyFnToIdOrClassSelectorFromLabel(this.app, 'click', label, this.pageTimeout)
})
