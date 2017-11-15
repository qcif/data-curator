import path from 'path'
import {remote} from 'electron'

export function setActiveGlobal(filename, title) {
  remote.getGlobal('tab').activeFilename = filename
  remote.getGlobal('tab').activeTitle = title
}

export function resetGlobalFilenames(filenames) {
  console.log('have current tab filenames...')
  console.log(filenames)
  remote.getGlobal('tab').filenames = filenames
  console.log('remote global is...')
  console.log(remote.getGlobal('tab'))
}

export function extractNameFromFile(fullPath) {
  let basename = path.basename(fullPath)
  let extension = path.extname(basename)
  return basename.substring(0, basename.lastIndexOf(extension))
}
