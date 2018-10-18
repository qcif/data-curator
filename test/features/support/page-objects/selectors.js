import _ from 'lodash'

export async function waitForVisibleIdFromLabel(app, parentSelector, label, timeout) {
  const kebabCase = _.kebabCase(label)
  const camelCase = _.camelCase(label)
  let result
  try {
    result = await app.client.waitForVisible(`${parentSelector} #${kebabCase}`, timeout)
    return result
  } catch (error) {
    console.log(`Unable to find via ${kebabCase} Trying ${camelCase}`)
    result = await app.client.waitForVisible(`${parentSelector} #${camelCase}`, timeout)
    return result
  }
}

export async function applyFnToIdOrClassSelectorFromLabel(app, fn, label, timeout) {
  try {
    const result = await applyFnToClassSelectorFromLabel(app, fn, label, timeout)
    return result
  } catch (error) {
    console.log(`Unable to find via class. Trying id`)
    result = await applyFnToIdSelectorFromLabel(app, fn, label, timeout)
    return result
  }
}

export async function applyFnToClassSelectorFromLabel(app, fn, label, timeout) {
  const result = await applyFnToSelectorWithLabel(app, fn, '.' + label, label, timeout)
  return result
}

export async function applyFnToIdSelectorFromLabel(app, fn, label, timeout) {
  const result = await applyFnToSelectorWithLabel(app, fn, '#' + label, label, timeout)
  return result
}

export async function applyFnToSelectorWithLabel(app, fn, selector, label, timeout) {
  // console.log('fn is:', fn)
  const selectors = replaceLabelWithKebabAndCamelCase(selector, label)
  const result = await applyFnToDualSelectors(app, fn, selectors[0], selectors[1], timeout)
  return result
}

export async function applyFnToDualSelectors(app, fn, selector1, selector2, timeout) {
  let result
  try {
    // console.log('fn is', fn)
    result = await app.client[fn](selector1, timeout)
    return result
  } catch (error) {
    console.log(`Unable to find via ${selector1} Trying ${selector2}`)
    result = await app.client[fn](selector2, timeout)
    return result
  }
}

export function replaceLabelWithKebabAndCamelCase(selector, toReplace) {
  const kebabCaseSelector = _.replace(selector, toReplace, _.kebabCase(toReplace))
  const camelCaseSelector = _.replace(selector, toReplace, _.camelCase(toReplace))
  return [kebabCaseSelector, camelCaseSelector]
}

export function kebabAndCamelCase(selector) {
  const kebabCase = _.kebabCase(selector)
  const camelCase = _.camelCase(selector)
  return { kebabCase, camelCase }
}
