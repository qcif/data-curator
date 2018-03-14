#!/usr/bin/env node
'use strict'
var fs = require('fs')
var _ = require('lodash')
var glob = require('glob')

glob.sync('build/*.@(zip|dmg|exe)').forEach(file => {
  console.log(file)
  var renamedFile = _.replace(file, ' ', '')
  fs.renameSync(file, renamedFile)
})
