#!/usr/bin/env node
'use strict'
const _ = require('lodash')
const jsonfile = require('jsonfile')
const badger = require('readme-badger')
const replace = require('replace-in-file')

function isTestCaseFailure (testCase) {
  return _.includes([
    'ambiguous', 'failed'
  ], testCase.result.status)
}

function isTestCaseSuccess (testCase) {
  return _.includes(['passed'], testCase.result.status)
}

function isTestCaseWarning (testCase) {
  return _.includes([
    'pending', 'undefined'
  ], testCase.result.status)
}

function tallyBasicStats (testCaseMap) {
  // stats for scenarios
  const scenarioTallies = {
    failures: 0,
    warnings: 0,
    success: 0
  }
  for (let feature of testCaseMap) {
    for (let scenario of feature.elements) {
      const element = {
        failures: 0,
        warnings: 0,
        success: 0,
        skipped: 0
      }
      for (let step of scenario.steps) {
        if (isTestCaseFailure(step)) {
          element.failures++
        } else if (isTestCaseWarning(step)) {
          element.warnings++
        } else if (isTestCaseSuccess(step)) {
          element.success++
        } else {
          element.skipped++
        }
      }
      if (element.failures > 0) {
        scenarioTallies.failures++
      } else if (element.warnings > 0) {
        scenarioTallies.warnings++
      } else if (element.success > 0) {
        scenarioTallies.success++
      }
    }
  }
  console.log('Tallied basic stats from cucumber report:', scenarioTallies)
  return scenarioTallies
}

function createAcceptanceTestBadge (scenarioTallies) {
  var readme = ''
  var imageUrl = 'https://img.shields.io/badge/acceptance%20tests-✔passed:%20' + scenarioTallies.success +
  '%20%20❌failed:%20' + scenarioTallies.failures +
  '%20%20❗undefined:%20' + scenarioTallies.warnings +
  '-orange.svg'
  var linkUrl = 'https://ci.appveyor.com/project/qcif/data-curator'
  var altText = 'Appveyor Acceptance Test status'

  var badge = badger.addBadge(readme, 'md', imageUrl, linkUrl, altText)

  console.log(`Acceptance Test badge generated: `, badge)
  return badge
}

function updatedAcceptanceTestBadgeInReadme (badge) {
  // swallow any whitespace before existing badge
  const changes = replace.sync({
    files: 'README.md',
    from: /[\s]+.*?Acceptance Test status.*data-curator./,
    to: `${badge}`
  })
  console.log('Updated readme badge: ', changes)
}

const jsonPath = require('path').join(__dirname, 'cucumber_report.json')
const testCaseMap = jsonfile.readFileSync(jsonPath)
const scenarioTallies = tallyBasicStats(testCaseMap)
const acceptanceTestBadge = createAcceptanceTestBadge(scenarioTallies)
updatedAcceptanceTestBadgeInReadme(acceptanceTestBadge)
console.log('post cucumber report script completed.')
