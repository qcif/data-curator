import { isValidPatternForType, supportedFormats } from '@/dateFormats.js'

const unSupportedTypes = {
  '%d/%m/%y': 'integer',
  '%d/%m/%Y': 'time',
  '%H:%M': 'datetime'
}

const unSupportedFormats = {
  '%d-%m-%y': 'date',
  '%Y/%m/%d': 'date',
  '%H:%M:%s': 'time'
}

describe('Date formats', function() {
  describe('Supported date formats', function() {
    const expectedResult = true
    for (const [nextPattern, nextType] of Object.entries(supportedFormats)) {
      it(`returns ${expectedResult} for type: ${nextType} with pattern: ${nextPattern} `, function () {
        expect(isValidPatternForType(nextPattern, nextType)).to.equal(expectedResult)
      })
    }
  })

  describe('Unsupported types', function() {
    const expectedResult = false
    for (const [nextPattern, nextType] of Object.entries(unSupportedTypes)) {
      it(`returns ${expectedResult} for type: ${nextType} with pattern: ${nextPattern} `, function () {
        expect(isValidPatternForType(nextPattern, nextType)).to.equal(expectedResult)
      })
    }
  })

  describe('Unsupported formats', function() {
    const expectedResult = false
    for (const [nextPattern, nextType] of Object.entries(unSupportedFormats)) {
      it(`returns ${expectedResult} for type: ${nextType} with pattern: ${nextPattern} `, function () {
        expect(isValidPatternForType(nextPattern, nextType)).to.equal(expectedResult)
      })
    }
  })
})
