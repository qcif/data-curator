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
