import { ipcRenderer as ipc } from 'electron'
import { allTablesAllColumnNames$ } from '@/rxSubject.js'
import store from '@/store'
import { HotRegister } from '@/hot.js'
import { pushAllTabTitlesSubscription } from '@/store/modules/tabs.js'

export function toggleHeaderWithFeedback (hot, errorFunction, successFunction) {
  if (hot.hasColHeaders()) {
    toggleHeaderOff(hot)
    successFunction()
    // ensure at least 2 rows before setting header
  } else if (hot.getData().length < 2) {
    ipc.send('hasHeaderRow', false)
    errorFunction()
  } else {
    toggleHeaderOn(hot)
    successFunction()
  }
}

export function toggleHeaderNoFeedback (hot) {
  if (hot.hasColHeaders()) {
    toggleHeaderOff(hot)
    // ensure at least 2 rows before setting header
  } else if (hot.getData().length < 2) {
    ipc.send('hasHeaderRow', false)
  } else {
    toggleHeaderOn(hot)
  }
}

export function toggleHeaderOff (hot) {
  let header = hot.getColHeader()
  let data = _.concat([header], hot.getData())
  updateHot(hot, data, { colHeaders: false, columnSorting: false })
  updateAllColumnsName(header.map(x => {
    return ''
  }))
  ipc.send('hasHeaderRow', false)
}

export function toggleHeaderOn (hot) {
  let data = hot.getData()
  let header = data[0]
  data = _.drop(data)
  updateHot(hot, data, { colHeaders: header, columnSorting: true })
  updateAllColumnsName(hot.getColHeader())
  ipc.send('hasHeaderRow', true)
}

function updateHot (hot, data, settings) {
  hot.loadData(data)
  hot.updateSettings(settings)
}

function updateAllColumnsName (values) {
  store.commit('pushAllColumnsProperty', {
    hotId: HotRegister.getActiveInstance().guid,
    key: 'name',
    values: values
  })
  // do not allow getter to cache as does not seem to pick up change
  allTablesAllColumnNames$.next(store.getters.getAllHotTablesColumnNames())
  pushAllTabTitlesSubscription()
}
