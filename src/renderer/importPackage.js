import fs from 'fs-extra'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import {extractNameFromFile} from '@/store/tabStoreUtilities.js'
// import unzip from 'unzip'

export function unzipFile(filename) {
  console.log(`unzipping ${filename}...`)
}
