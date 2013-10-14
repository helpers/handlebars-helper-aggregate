/*
 * {{aggregate}}
 * https://github.com/assemble/aggregate
 *
 * Copyright (c) 2013 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    book: require('./test/fixtures/metadata/book.yml'),
    blog: require('./test/fixtures/metadata/blog.yml'),

    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'index.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    assemble: {
      options: {
        flatten: true,
        layout: 'test/fixtures/default.hbs',    
        data: ['test/fixtures/metadata/book.yml'],
        // Register this helper
        helpers: ['./index.js', 'helper-prettify'],
        aggregate: {
          cwd: 'test/fixtures',
          sep: '<!-- separator defined in Gruntfile -->'
        }
      },
      // No options defined
      no_opts_defined: {
        options: {
          aggregate: {}
        },
        src: ['test/fixtures/pages/toc.hbs'],
        dest: 'test/actual/no_opts_defined/'
      },
      // Basic compare function
      compare_function_one: {
        src: ['test/fixtures/pages/toc.hbs'],
        dest: 'test/actual/no_opts_defined/',
        options: {
          aggregate: {
            compare: function (a, b) {
              return a.index >= b.index ? 1 : -1;
            }
          }
        }
      },
      // Alternative compare function
      compare_function_two: {
        src: ['test/fixtures/pages/toc.hbs'],
        dest: 'test/actual/no_opts_defined/',
        options: {
          aggregate: {
            compare: function(a, b) {
              a = a.context.chapter;
              b = b.context.chapter;
              if(a === b) {
                return 0;
              } else if (a > b) {
                return 1;
              } else {
                return -1;
              }
            }
          }
        }
      }
    },

    // Before generating any new files,
    // remove files from previous build.
    clean: {
      example: ['test/actual/*.html']
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('assemble');

  // Default to tasks to run with the "grunt" command.
  grunt.registerTask('default', ['clean', 'jshint', 'assemble']);
};
