import { app } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

const forceDownload = !!process.env.UPGRADE_EXTENSIONS
const extensions = [VUEJS_DEVTOOLS]

app.whenReady().then(() => {
  installExtension(extensions, { loadExtensionOptions: { allowFileAccess: true }, forceDownload: false })
    .then((name) => {
      console.log(`Added Extension:  ${name}`)
    })
    .catch((err) => console.log(`Unable to install ${extensions}: \n`, err))
})

// Require `main` process to boot app
require('./index')
