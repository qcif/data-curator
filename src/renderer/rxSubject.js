import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import 'rxjs/add/observable/fromPromise'

let allTablesAllColumnNames$ = new Subject()
let allTablesAllColumnsFromSchema$ = new Subject()
let activeTab$ = new Subject()
let hotIdFromTab$ = new Subject()
let allTabsTitles$ = new Subject()
let provenanceErrors$ = new ReplaySubject(1)
let currentPos$ = new Subject()
let fkPackagesButtonText$ = new Subject()
let loadingPackage$ = new Subject()
const errorFeedback$ = new Subject()
const updateHotDimensions$ = new Subject()
const allTableLocks$ = new Subject()

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
  currentPos$,
  fkPackagesButtonText$,
  loadingPackage$,
  errorFeedback$,
  updateHotDimensions$,
  allTableLocks$
}
