function generateSchemaFromHeader() {
  var window = BrowserWindow.getFocusedWindow()
  window.webContents.send('schemaFromHeaders')
}

module.exports = {
  generateSchemaFromHeader
}
