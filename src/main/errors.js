import {focusOrNewSecondaryWindow} from './windows'

export function showErrors() {
  let browserWindow = focusOrNewSecondaryWindow('errors', {width: 760, height: 400})
  browserWindow.on('focus', (event) => {
    console.log('in focus')
  })
}
