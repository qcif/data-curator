import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/fromPromise'
// import Rx from 'rxjs/Rx'

let allTablesAllColumnNames$ = new Subject()
let activeTab$ = new Subject()
let hotIdFromTab$ = new Subject()
let allTabsTitles$ = new Subject()
let selectedForeignTable$ = new Subject()
let selectedForeignLocalHeaders$ = new Subject()
let pushEmptyForeignKey$ = new Subject()
let currentForeignHeaders$ = new Subject()
// let getSelectedLocalKeys$ = new Subject()

export function onNextHotIdFromTabRx(asyncFunction) {
  let subject = hotIdFromTab$
  // console.log(`subject is ${subject}`)
  // console.log(`asyncfunction is...`)
  // console.log(asyncFunction)
  onNextTabRx(subject, asyncFunction)
}

export function onNextTabRx(subject, asyncFunction) {
  activeTab$.subscribe(function(activeTab) {
    // console.log(`subscribed to next tab: ${activeTab}`)
    onNextSubjectFromPromise(subject, asyncFunction(activeTab))
  })
}

export function onNextSubjectFromPromise(subject, promise) {
  Observable.fromPromise(promise).subscribe(function(value) {
    // console.log(`observed promised value: ${value}`)
    subject.next(value)
  })
}

export {
  hotIdFromTab$,
  activeTab$,
  allTablesAllColumnNames$,
  allTabsTitles$,
  selectedForeignTable$,
  pushEmptyForeignKey$,
  selectedForeignLocalHeaders$,
  currentForeignHeaders$
  // getSelectedLocalKeys$
}
