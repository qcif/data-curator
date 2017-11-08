import fs from 'fs-extra'
import path from 'path'
import tabStore from '@/store/modules/tabs.js'
import hotStore from '@/store/modules/hots.js'
import {extractNameFromFile} from '@/store/tabStoreUtilities.js'

export function unzipFile(filename) {
  console.log(`unzipping ${zipSource}...`)
  let unzipDestination = path.dirname(zipSource)
  console.log(`destination dir is ${unzipDestination}`)
}

//  // fs.createReadStream(unzipDestination).pipe(unzip.Extract({ path: destPath }))
//  fs.createReadStream(zipSource).pipe(unzip.Parse()).on('entry', function(entry) {
//    var filename = entry.path
//    var type = entry.type // 'Directory' or 'File'
//    var size = entry.size
//    console.log(entry)
//    console.log(filename)
//    console.log(type)
//    console.log(size)
//    // if (fileName === "this IS the file I'm looking for") {
//    try {
//      entry.pipe(fs.createWriteStream(`${unzipDestination}/${filename}`))
//    } catch (err) {
//      console.log('There was a problem importing zip')
//      console.log(err)
//      entry.autodrain()
//    }
//    // } else {
//    //   entry.autodrain()
//    // }
//  })
// }
