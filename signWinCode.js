exports.default = async function(configuration) {
  var child_process = require('child_process')

  child_process.spawnSync('sign.bat', ['build\\win-unpacked\\DataCurator.exe'], {
    stdio: 'inherit',
    shell: true
  })

  child_process.spawnSync('sign.bat', ['build\\win-ia32-unpacked\\DataCurator.exe'], {
    stdio: 'inherit',
    shell: true
  })
}
