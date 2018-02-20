import utils from '../utils'
// import sinon from 'sinon'
// import * as sinonTestFactory from 'sinon-test'

describe('Guess Column Properties', function() {
  // const sinonTest = sinonTestFactory.configureTest(sinon, {useFakeTimers: false})
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)
  const _ = require('lodash')
  it('Guess column properties with no data is successful', function() {
    return this.app.client.element('#toolbar')
      .element('#guess-column-properties')
      .click()
      .waitForVisible('#message-panel', 1000)
      .getText('#error-message')
      .then(text => {
        console.log(text)
        expect(text).to.equal('Success: Guess column properties succeeded.')
      })
  })
})
