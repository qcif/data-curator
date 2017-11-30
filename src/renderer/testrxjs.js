import Rx from 'rxjs/Rx'
let counter = 0
// let testOb = Rx.Observable.from(['foo', 'bar', counter])
// let testOb = Rx.Observable.of(counter)
let testOb = new Rx.Subject()
let test1 = {
  // counter: 0,
  act() {
    counter++
    console.log('triggered test1...')
    console.log(`counter is ${counter}`)
    testOb.next(counter)
  }
}

export function test2() {
  console.log('inside test2 function...')
  return testOb.subscribe(value => console.log(value))
}

export {
  test1,
  testOb,
  counter
}
