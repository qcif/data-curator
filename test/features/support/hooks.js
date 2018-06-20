import { Application } from 'spectron'
import electron from 'electron'
import { After, Before, Status, Given, When, Then, AfterAll} from 'cucumber'
import fakeDialog from 'spectron-fake-dialog'
import { expect, should, assert } from 'chai'
import {exec} from 'child_process'
import fs from 'fs-extra'
import { formatSummary } from 'cucumber/lib/formatter/helpers/summary_helpers.js'
import getColorFns from 'cucumber/lib/formatter/get_color_fns'
// var jsonfile = require('jsonfile')
import etl from 'etl'
const _ = require('lodash')

const IS_ISSUE = {
  [Status.AMBIGUOUS]: true,
  [Status.FAILED]: true,
  [Status.PASSED]: false,
  [Status.PENDING]: true,
  [Status.SKIPPED]: false,
  [Status.UNDEFINED]: true
}

const failures = []
const warnings = []
const success = []

// function isIssue(status) {
//   return IS_ISSUE[status]
// }

function isTestCaseFailure(testCase) {
  return _.includes([Status.AMBIGUOUS, Status.FAILED], testCase.result.status)
}

function isTestCaseSuccess(testCase) {
  return _.includes([Status.PASSED], testCase.result.status)
}

function isTestCaseWarning(testCase) {
  return _.includes(
    [Status.PENDING, Status.UNDEFINED],
    testCase.result.status
  )
}

async function stopAppRunning(app) {
  try {
    if (app && app.isRunning()) {
    // console.log('Attempting to stop app...')
      const result = await app.stop()
    }
    // this is just in case for slower OS/windows - catch any error and ignore
    if (app && app.electron) {
      const forceQuitResult = await this.app.electron.ipcRenderer.sendSync('forceQuit')
    // console.log(`force quit?`, result3)
    }
  } catch (error) {
    // console.log('error caught when stopping run. ignoring')
  }
}

function tallyTestAppveyor(testCase) {
  if (process.env.APPVEYOR) {
    console.log('appveyor tally...')
    exec(`appveyor AddTest -Name ${testCase.pickle.name} -Framework Spectron -Filename ${testCase.sourceLocation.uri} -Outcome ${testCase.result.status} -Duration ${testCase.result.duration}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    })
  }
}

After({timeout: 40000}, async function (testCase) {
  try {
    // console.log('Starting after hook....')
    // console.log(testCase)
    // console.log(testCase.pickle.steps[0])
    if (testCase.result.status === Status.FAILED) {
      if (this.app && this.app.browserWindow) {
        const imageBuffer = await this.app.browserWindow.capturePage()
        await this.attach(imageBuffer, 'image/png')
        // console.log('got attachment in', attachResult)
      }
    }
    // if (isTestCaseFailure(testCase)) {
    //   failures.push(testCase)
    // } else if (isTestCaseWarning(testCase)) {
    //   warnings.push(testCase)
    // } else if (isTestCaseSuccess(testCase)) {
    //   success.push(testCase)
    // } else {
    //   console.log('nothing pushed')
    // }
    tallyTestAppveyor(testCase)
    // stopAppRunning(this.app)
  } catch (error) {
    console.log('error in after hook', error)
  } finally {
    await stopAppRunning(this.app)
  }
})

// AfterAll(async function () {
//   let result
//   try {
//     console.log('Starting after all hook....')
//     console.log(`failures are`, failures)
//     console.log(`warnings are`, warnings)
//     console.log(`success are`, success)
//     // const jsonPath = require('path').join(__dirname, '../../cucumber_report.json')
//     // let testCaseMap = fs.readFileSync(jsonPath)
//     // console.log(`path is`, jsonPath)
//     // let testCaseMap = {}
//     // let testCaseMap = jsonfile.readFileSync(jsonPath)
//     // let testCaseMap = await jsonfile.readFile(jsonPath)
//     // fs.readFile(jsonPath, 'utf8', function readFileCallback(err, data) {
//     //   if (err) {
//     //     console.log(err)
//     //   } else {
//     //     let obj = JSON.parse(data) // now it an object
//     //     console.log(`next obj is`, obj)
//     //   }
//     // })
//     // let value = await etl.file(jsonPath)
//     //   .pipe(etl.stringify())
//     //   .promise()
//     // // etl always returns an array
//     // if (_.isEmpty(value)) {
//     //   throw new Error(`Unable to find text in filename: ${jsonPath}`)
//     // }
//     // let testCaseMap = JSON.parse(value).text
//     // // let testCaseMap = {}
//     // console.log(`test case map is`, testCaseMap)
//     // let testRun = { result: { duration: 0 } }
//     // let cucumberSummaryOptions = {
//     //   colorFns: getColorFns(false),
//     //   testCaseMap: testCaseMap,
//     //   testRun: testRun
//     // }
//     // result = formatSummary(cucumberSummaryOptions)
//   } catch (error) {
//     console.log('error in after hook', error)
//   } finally {
//     // await stopAppRunning(this.app)
//     console.log(`final result is`)
//     console.log(result)
//   }
// })

Before({timeout: 20000}, async function (testCase) {
  try {
    // console.log('Starting before hook....')
    console.log(`Starting test scenario: ${testCase.pickle.name} in: ${testCase.sourceLocation.uri}`)
    // console.log(testCase.pickle.steps)
    this.rowNumber = null
    this.colNumber = null
    this.latestFilePath = null
    this.pageTimeout = 5000
    await fakeDialog.apply(this.app)
    await this.app.start()
    await this.app.client.waitUntilWindowLoaded()
    await this.app.electron.ipcRenderer.sendSync('unlockSingleton')
    await this.app.client.browserWindow.focus()
    const result = await this.app.client.browserWindow.isFocused()
    await this.app.electron.ipcRenderer.sendSync('SPECTRON_FAKE_DIALOG/SEND', [{method: 'showMessageBox', value: 1}])
    await this.app.electron.ipcRenderer.sendSync('SPECTRON_FAKE_DIALOG/SEND', [{method: 'showOpenDialog', value: this.openFileDialogReturned}])
  } catch (error) {
    console.log('error in before hook', error)
    await stopAppRunning(this.app)
  }
})
