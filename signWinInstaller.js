#!/usr/bin/env node
'use strict'

var child_process = require('child_process')
var glob = require('glob')

var buildArtifacts = glob.sync('build/DataCurator*Setup*.exe', {ignore: ['build/DataCurator*Setup*.exe?', 'build/DataCurator*Setup*.exe.*']})

console.log('Found build artifacts: ')
console.log(buildArtifacts)

var arg = '"' + buildArtifacts[0] + '"'

child_process.spawnSync('sign.bat', [arg], {
  stdio: 'inherit',
  shell: true
})
