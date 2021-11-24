import { expect } from 'chai'

export async function expectFailureMessageWithText (app, message) {
  const messageText = await getMessageDetailsPanelText(app)
  const regexp = messageAsRegExp(`Failed: ${message}`)
  expect(messageText).to.match(regexp)
}

export async function expectSuccessMessageWithText (app, message) {
  const messageText = await getMessageDetailsPanelText(app)
  const regexp = messageAsRegExp(`Success: ${message}`)
  expect(messageText).to.match(regexp)
}

export async function getMessageDetailsPanelText (app) {
  return (await (await getMessagePanel(app)).$('#other-message span')).getHTML(false)
}

export async function getMessageDetailsPanel (app) {
  return (await getMessagePanel(app)).$('#other-message')
}

export async function getMessagePanel (app) {
  return app.client.$('#message-panel')
}

export function messageAsRegExp (message) {
  return new RegExp(`^.*${message}.*$`, 'm')
}

const validationMessages = {
  'No Column Properties': /Column properties, including the column properties of any foreign keys, must be set./,
  'Blank Row': /Row [\d+] is completely blank/
}

export {
  validationMessages
}
