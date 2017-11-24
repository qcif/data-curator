// import { Subject } from 'rxjs/Subject'
// import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx'

let activeHotAllColumnNames = new Rx.Subject()
let activeTabColumnProperties = new Rx.Subject()
let activeRxTab = new Rx.Subject()
// let activeRxHotId = new Rx.Subject()
let hotIdRxFromTab = new Rx.Subject()
let propertyType = new Rx.Subject()

export function onNextHotIdRx(hotIdFunction) {
  activeRxTab.subscribe(function(activeTab) {
    console.log(`subscribed to next tab: ${activeTab}`)
    onNextSubjectFromPromise(hotIdRxFromTab, hotIdFunction(activeTab))
  })
}

export function onNextSubjectFromPromise(subject, promise) {
  Rx.Observable.fromPromise(promise).subscribe(function(value) {
    console.log(`observed promised value: ${value}`)
    subject.next(value)
  })
}

export {
  activeHotAllColumnNames,
  activeRxTab,
  hotIdRxFromTab,
  propertyType,
  activeTabColumnProperties
}
