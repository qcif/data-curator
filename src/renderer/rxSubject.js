import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import 'rxjs/add/observable/fromPromise'
// import Rx from 'rxjs/Rx'

let allTablesAllColumnNames$ = new Subject()
let allTablesAllColumnsFromSchema$ = new Subject()
let activeTab$ = new Subject()
let hotIdFromTab$ = new Subject()
let allTabsTitles$ = new Subject()
let provenanceErrors$ = new ReplaySubject(1)
let searchCounter$ = new Subject()
// let selectedForeignTable$ = new Subject()
// let getSelectedLocalKeys$ = new Subject()

export function onNextHotIdFromTabRx(asyncFunction) {
  let subject = hotIdFromTab$
  onNextTabRx(subject, asyncFunction)
}

export function onNextTabRx(subject, asyncFunction) {
  activeTab$.subscribe(function(activeTab) {
    onNextSubjectFromPromise(subject, asyncFunction(activeTab))
  })
}

export function onNextSubjectFromPromise(subject, promise) {
  Observable.fromPromise(promise).subscribe(function(value) {
    subject.next(value)
  })
}

export {
  hotIdFromTab$,
  activeTab$,
  allTablesAllColumnNames$,
  allTablesAllColumnsFromSchema$,
  allTabsTitles$,
  provenanceErrors$,
  searchCounter$
}
