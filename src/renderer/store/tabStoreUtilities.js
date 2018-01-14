import path from 'path'
import {remote} from 'electron'

export function setActiveGlobal(filename, title) {
  remote.getGlobal('tab').activeFilename = filename
  remote.getGlobal('tab').activeTitle = title
}

export function resetGlobalFilenames(filenames) {
  remote.getGlobal('tab').filenames.length = 0
  remote.getGlobal('tab').filenames.push(...filenames)
}

export function extractNameFromFile(fullPath) {
  let basename = path.basename(fullPath)
  let extension = path.extname(basename)
  return basename.substring(0, basename.lastIndexOf(extension))
}
