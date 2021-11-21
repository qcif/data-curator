import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { app } from 'electron'

// load browser dev tools
require('./devTools.js')

const forceDownload = !!process.env.UPGRADE_EXTENSIONS
const extensions = [VUEJS_DEVTOOLS]

// load vuejs tools in browser dev tools
app.whenReady().then(() => {
  installExtension(extensions, { loadExtensionOptions: { allowFileAccess: true }, forceDownload: forceDownload })
    .then((name) => {
      console.log(`Added Extension:  ${name}`)
    })
    .catch((err) => console.log(`Unable to install ${extensions}: \n`, err))
})

// Require `main` process to boot app
require('./index')
