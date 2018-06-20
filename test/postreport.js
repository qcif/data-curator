#!/usr/bin/env node
'use strict'
var fs = require('fs-extra')
// var formatSummary = require('cucumber/lib/formatter/helpers/summary_helpers.js')
// import getColorFns from 'cucumber/lib/formatter/get_color_fns'
// var jsonfile = require('jsonfile')
var etl = require('etl')
const _ = require('lodash')
var glob = require('glob')
var jsonfile = require('jsonfile')

const jsonPath = require('path').join(__dirname, 'cucumber_report.json')
let testCaseMap = jsonfile.readFileSync(jsonPath)
// let value = etl.file(jsonPath)
//   .pipe(etl.stringify())
//   .promise()
//   .then(function() {
//     // etl always returns an array
//     if (_.isEmpty(value)) {
//       throw new Error(`Unable to find text in filename: ${jsonPath}`)
//     }
//     let testCaseMap = JSON.parse(value).text
//     console.log('test case')
//     console.log(testCaseMap)
//   })

console.log('test case')
console.log(testCaseMap)
for (let testCase of testCaseMap) {
  console.log('next')
  console.log(testCase)
}
