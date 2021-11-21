import _ from 'lodash'
import { mockShell } from './mockMainProcess'

export function mapArrayToInteger (array, i) {
  _.map(array, function (element) {
    if (!_.isInteger(element)) {
      element = i
    }
  })
}

export function sendOpenUrlCall (url) {
  return mockShell([{ method: 'openExternal', value: url }])
}

export async function collectText (collection) {
  return collectWithFn(collection, 'getText')
}

export async function collectWithFn (collection, func, args) {
  const collected = []
  for (const nextCollect of collection) {
    const value = args ? await nextCollect[func](args) : await nextCollect[func]()
    collected.push(value)
  }
  return collected
}

export async function waitForDisplayedDefault (el) {
  return el.waitForDisplayed({ timeout: 500 })
}
