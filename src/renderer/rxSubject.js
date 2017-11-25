// import { Subject } from 'rxjs/Subject'
// import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx'

let activeHotAllColumnNames = new Rx.Subject()
// let activeTabColumnProperties
let activeRxTab = new Rx.Subject()
let hotIdRxFromTab = new Rx.Subject()
let propertyType = new Rx.Subject()

export function onNextTabRx(subject, tabFunction) {
  activeRxTab.subscribe(function(activeTab) {
    console.log(`subscribed to next tab: ${activeTab}`)
    onNextSubjectFromPromise(subject, tabFunction(activeTab))
  })
}

export function onNextSubjectFromPromise(subject, promise) {
  Rx.Observable.fromPromise(promise).subscribe(function(value) {
    console.log(`observed promised value: ${value}`)
    subject.next(value)
  })
}

export {
  activeRxTab,
  // hotIdRxFromTab,
  propertyType,
  activeTabColumnProperties,
  activeHotAllColumnNames
}
