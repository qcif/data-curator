import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/fromPromise'
// import Rx from 'rxjs/Rx'

let activeHotAllColumnNames$ = new Subject()
let activeTab$ = new Subject()
let hotIdFromTab$ = new Subject()

export function onNextHotIdFromTabRx(asyncFunction) {
  let subject = hotIdFromTab$
  console.log(`subject is ${subject}`)
  onNextTabRx(subject, asyncFunction)
}

export function onNextTabRx(subject, asyncFunction) {
  activeTab$.subscribe(function(activeTab) {
    console.log(`subscribed to next tab: ${activeTab}`)
    onNextSubjectFromPromise(subject, asyncFunction(activeTab))
  })
}

export function onNextSubjectFromPromise(subject, promise) {
  Observable.fromPromise(promise).subscribe(function(value) {
    console.log(`observed promised value: ${value}`)
    subject.next(value)
  })
}

export {
  hotIdFromTab$,
  activeTab$,
  activeHotAllColumnNames$
}
