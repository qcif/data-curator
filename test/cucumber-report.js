var reporter = require('cucumber-html-reporter')

var options = {
  theme: 'bootstrap',
  jsonFile: 'test/cucumber_report.json',
  output: 'test/cucumber_report.html',
  reportSuiteAsScenarios: true,
  launchReport: false,
  storeScreenshots: false
}

reporter.generate(options)
