module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        options:
            bare: false
            sourceMap: false
        files:
          'src/js/SlidingContent.js': 'src/js/SlidingContent.coffee'

  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.registerTask 'default', ['coffee:compile']
