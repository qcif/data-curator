import 'babel-polyfill'
// import * as RxDB from 'rxdb'
import * as PouchDB from 'pouchdb'
import {remote, ipcRenderer as ipc} from 'electron'
PouchDB.plugin(require('pouchdb-adapter-idb'))
// Components.utils.importGlobalProperties(['indexedDB'])
let db
let hotObjectStore
// let objectStore
let request

// const windowSchema = {
//   'title': 'window',
//   'version': 0,
//   'description': 'describes a window',
//   'type': 'object',
//   'properties': {
//     'id': {
//       'type': 'string',
//       'primary': true
//     },
//     activeGuid: {
//       ref: 'hot',
//       type: 'string'
//     }
//   }
// }
//
// const hotSchema = {
//   'title': 'hot',
//   'version': 0,
//   'description': 'describes a handsontable collection',
//   'type': 'object',
//   'properties': {
//     'guid': {
//       'type': 'string',
//       'primary': true
//     },
//     'hot': {
//       'type': 'object'
//     },
//     window: {
//       ref: 'window',
//       type: 'string'
//     }
//   },
//   required: ['hot, window']
// }

// let windowCollection = null
// let hotCollection = null

// async function createCollection(doc) {
//   let collection = await database.collection({name: `${doc.title}`, schema: doc})
//   console.log(collection)
//   // return collection
// }

// export async function createDatabase() {
// db = await RxDB.create({name: 'datacurator', adapter: 'idb'}).then(
// RxDB
//   .create({
//     name: 'datacurator',
//     adapter: 'idb'
//   })
//   .then(function(database) {
//     console.log('creating window-collection..')
//     db = database
//     return database.collection({name: 'window', schema: windowSchema})
//   })
//   .then(function(database) {
//     console.log('creating hot-collection..')
//     database.collection({name: 'hot', schema: hotSchema})
//   })
// }

// async function doAsyncOp() {
//   var vals = await Promise.all([
//     RxDB.create({name: 'datacurator', adapter: 'idb'}),
//     createWindowCollection(),
//     createHotCollection()
//   ])
//   vals.forEach(console.log.bind(console))
//   return vals
// }

// async function createWindowCollection() {
//   return database.collection({name: 'window', schema: windowSchema})
//   // console.log('Created window collection.')
// }

// async function createHotCollection() {
//   return database.collection({name: 'hot', schema: hotSchema})
//   // console.log('Created hot collection.')
// }

// ipc.once('initStorage', (event, arg) => {
//   initStorage()
//   // console.log('pre...')
//   // ipc.send('initStorageCompleted', 'Storage initialisation completed.')
//   event.returnValue = 'initStorageCompleted'
// })

// async function doAsyncOp4() {
//   var database = await RxDB.create({name: 'datacurator', adapter: 'idb'})
//   database = await database.collection({name: 'window', schema: windowSchema})
//   return database.collection({name: 'hot', schema: hotSchema})
// };
//
// async function doAsyncOp2() {
//   let docs = [windowSchema, hotSchema]
//   let promises = docs.map((doc) => db.collection({name: `${doc.title}`, schema: doc}))
//   let results = []
//   for (let promise of promises) {
//     results.push(await promise)
//   }
//   console.log(results)
//   return results
// }
//
// async function doAsyncOp3() {
//   db = await RxDB.create({name: 'datacurator', adapter: 'idb'})
//   let docs = [windowSchema, hotSchema]
//   for (let doc of docs) {
//     await db.collection({name: `${doc.title}`, schema: doc})
//   }
//   console.log(db)
// }

// export async function initStorage0() {
//   try {
//     // db = await createDatabase()
//     RxDB.create({adapter: 'idb', name: 'datacurator'}).then(db => {
//       database = db
//       // create collection
//       console.log('creating window-collection..')
//       // for (let doc of [windowSchema, hotSchema]) {
//       //   createCollection(doc)
//       //   console.log('created...')
//       // }
//       createCollection(windowSchema)
//       createCollection(hotSchema)
//       // hotCollection = createHotCollection()
//       console.dir(database)
//     })
//     // console.dir(db)
//     // let results = doAsyncOp2()
//     // await doAsyncOp()
//
//     // let database = createWindowCollection(db)
//     // database = createHotCollection(db)
//     // console.dir(db.window)
//     // console.dir(db.hotcollection)
//   } catch (err) {
//     console.log(err)
//   }
// }

export async function initStorage() {
  const dbName = 'datacurator'
  request = indexedDB.open(dbName, 2)
  request.onerror = function(event) {
    console.log("Why didn't you allow my web app to use IndexedDB?!")
  }
  // request.onsuccess = function(event) {
  //   db = event.target.result
  //   console.log('success db!')
  // }

  request.onupgradeneeded = function(event) {
    var db = event.target.result

    // Create an objectStore to hold information about our customers. We're
    // going to use "ssn" as our key path because it's guaranteed to be
    // unique - or at least that's what I was told during the kickoff meeting.
    var objectStore = db.createObjectStore('hots', { keyPath: 'guid' })

    // Create an index to search customers by name. We may have duplicates
    // so we can't use a unique index.
    // objectStore.createIndex('name', 'name', { unique: false })
    //
    // // Create an index to search customers by email. We want to ensure that
    // // no two customers have the same email, so use a unique index.
    // objectStore.createIndex('email', 'email', { unique: true })

    // Use transaction oncomplete to make sure the objectStore creation is
    // finished before adding data into it.
    objectStore.transaction.oncomplete = function(event) {
      // Store values in the newly created objectStore.
      hotObjectStore = db.transaction('hots', 'readwrite').objectStore('hots')
    }
  }
}

export function initStorage0() {
  PouchDB.debug.disable()
  console.dir(PouchDB.adapters)
  db = new PouchDB('datacurator', {adapter: 'idb'})
  console.log('database created.')
  console.dir(db)
  db.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (docs) {
    console.dir(docs.rows)
  }).catch(function (err) {
    console.log(err)
  })
}

function getWindowId() {
  console.log('getting window id...')
  return remote.getCurrentWebContents().id
}

ipc.once('destroyDb', () => {
  console.log('destroying db')
  db.destroy().then(function (response) {
    console.log('destroyed')
  // success
  }).catch(function (err) {
    console.log(err)
  })
})

// ipc.once('initStorage', (event, arg) => {
//   initStorage()
//   // console.log('pre...')
//   // ipc.send('initStorageCompleted', 'Storage initialisation completed.')
//   event.returnValue = 'initStorageCompleted'
// })

// async function insertCurrentWindow() {
//   try {
//     const doc = await db.window.insert({id: getWindowId()})
//     console.log(doc)
//   } catch (err) {
//     console.log(err)
//   }
// }

// export async function insertHot0(hot) {
//   try {
//     // for (let doc of database.schemas) {
//     //   console.log('next')
//     //   console.dir(doc)
//     // }
//     // console.dir(database.collection('hot'))
//     // let col = await database.collections
//     // console.log('next')
//     // console.log(windowCollection)
//     // console.dir(col)
//     let doc = hotCollection.insert({hot: hot, guid: hot.guid, window: getWindowId()})
//     console.log('Hot insert completed.')
//     console.dir(doc)
//   } catch (err) {
//     console.log(err)
//   }
// }

export function insertHot(hot) {
  request.onsuccess = function(event) {
    db = event.target.result
    console.log('success db!')
    let windowId = `${getWindowId()}`
    let guid = `${hot.guid}`
    console.log('window id is: ' + windowId)
    console.log('guid is: ' + guid)
    const data = [{guid: `${guid}`, hot: hot, windowId: `${windowId}`}]
    var transaction = db.transaction(['hots'], 'readwrite')
    // Do something when all the data is added to the database.
    transaction.oncomplete = function(event) {
      console.log('All done!')
    }

    transaction.onerror = function(event) {
      console.log(`Couldn't insert!`)
    // Don't forget to handle errors!
    }

    var objectStore = transaction.objectStore('hots')
    try {
      for (var i in data) {
        var request2 = objectStore.add(data[i])
        request2.onsuccess = function(event) {
          console.log('yay')
          // event.target.result == data[i].ssn;
        }
        request2.onerror = function(event) {
          console.log('failed insert!')
        }
      }
    } catch (err) {
      console.log('caught failed insert!')
      console.log(err)
    }
  // for (var i in data) {
  //   hotObjectStore.add(customerData[i])
  // }
  }
}

export function insertHot0(hot) {
  // for (let doc of database.schemas) {
  //   console.log('next')
  //   console.dir(doc)
  // }
  // console.dir(database.collection('hot'))
  // let col = await database.collections
  // console.log('next')
  // console.log(windowCollection)
  // console.dir(col)
  console.log('req')
  console.log(req)
  let windowId = `${getWindowId()}`
  let guid = `${hot.guid}`
  console.log('window id is: ' + windowId)
  console.log('guid is: ' + guid)
  db.put({_id: guid, hot: hot.getData(), name: 'hot', window: windowId}).then(function() {
    return db.get(guid)
  // }).then(function() {
  //   db.put({_id: windowId, name: 'window', activeGuid: guid})
  }).then(function() {
    console.log('Hot insert completed.')
    console.dir(db)
    console.dir(db.get(guid))
  }).catch(function(err) {
    console.log('error...')
    console.log(err)
  })
  let rev = db.get(guid).then(function (doc) {
    // var attachment = new Blob(hot, {type: 'text/html'})
    var map1 = {}
    map1[guid] = hot
    var attachment = Buffer.from(map1)
    db.putAttachment(guid, 'hot', doc._rev, attachment, 'text/html').then(function (result) {
      console.dir(db.get(guid))
    }).catch(function (err) {
      console.log(err)
    })
  }).catch(function (err) {
    console.log(err)
  })
  // console.dir(`rev is ${rev}`)
  // // var attachment = new Blob(hot, {type: 'text/plain'})
  // db.putAttachment(guid, 'hot', rev, hot, 'text/plain').then(function (result) {
  //   console.dir(db.get(guid))
  // }).catch(function (err) {
  //   console.log(err)
  // })
}
