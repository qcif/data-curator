module.exports = grunt => {
  // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
  require('load-grunt-tasks')(grunt, {pattern: 'grunt-cucumber-*'})

  grunt.initConfig({
    cucumber_coverage: {
      datacurator: {
        src: 'features',
        options: {
          target: 'src',
          coverage: 'logs/coverage',
          format: 'pretty', // showing output of feature execution (default: pretty)
          print: 'detail', // display results of coverage to console (default: summary)
          report: 'html', // generate a coverage report (default: lcov)
          steps: 'features/step_definitions',
          support: 'features/support'
        }
      }
    }
  })

  grunt.registerTask('test', ['cucumber_coverage'])
}
