import { ipcRenderer as ipc } from 'electron'
import { allTableLocks$ } from '@/rxSubject.js'
import store from '@/store'
import { HotRegister } from './hot'

const LockProperties = {

  storeName: 'isTableLocked',

  toggleLockColumnProperties () {
    const hotId = HotRegister.getActiveInstance().guid
    let isActiveHotLocked = !!this.isColumnPropertiesLocked(hotId)
    isActiveHotLocked = !isActiveHotLocked
    this.updateStoredTableLock(hotId, isActiveHotLocked)
    ipc.send('hasLockedColumns', isActiveHotLocked)
  },

  updateStoredTableLock (hotId, value) {
    store.commit('pushTableProperty', {
      hotId: hotId,
      key: this.storeName,
      value: !!value
    })
    allTableLocks$.next(store.getters.getPropertyFromAllTables(this.storeName))
  },

  isColumnPropertiesLocked (hotId) {
    let allLocks = store.getters.getPropertyFromAllTables(this.storeName)
    return _.includes(allLocks, hotId)
  }
}

ipc.on('toggleLockColumnProperties', function (event, arg) {
  LockProperties.toggleLockColumnProperties()
})

allTableLocks$.next(store.getters.getPropertyFromAllTables(LockProperties.storeName))

export {
  LockProperties
}
