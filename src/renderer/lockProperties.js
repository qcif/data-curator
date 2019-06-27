import { ipcRenderer as ipc } from 'electron'
import { allTableLocks$ } from '@/rxSubject.js'
import store from '@/store'
import { HotRegister } from './hot'

const LockProperties = {

  storeName: 'isTableLocked',

  toggleLockColumnProperties () {
    const hotId = HotRegister.getActiveInstance().guid
    let currentLock = _.includes(this.getLockedTables(), hotId)
    currentLock = !currentLock
    this.updateStoredTableLock(hotId, currentLock)
  },

  getLockedTables() {
    return store.getters.hasPropertyFromAllTables(this.storeName)
  },

  updateStoredTableLock (hotId, value) {
    store.commit('pushTableProperty', {
      hotId: hotId,
      key: this.storeName,
      value: !!value
    })
    this.trigger()
  },

  trigger() {
    allTableLocks$.next(this.getLockedTables())
  }
}

ipc.on('toggleLockColumnProperties', function (event, arg) {
  LockProperties.toggleLockColumnProperties()
})

export {
  LockProperties
}
