'use strict';

module.exports = function(grunt) {

    // load all required modules
    require('jit-grunt')(grunt);
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({

        clean: {
            all: ['dist', 'app/js/app.min.js', 'app/css/style.css'],
            bower: ['libs/*/*', '!libs/*/dist']
        },

        concat: {
            dist_css: {
                src: ['app/css/normalize.css', 'app/css/app.css'],
                dest: 'app/css/style.css'
            }
        },

        // TODO: fix too much noise, it copies everything
        copy: {
            dist: {
              files: [
                // makes all src relative to cwd
                {
                  expand: true,
                  cwd: 'app/',
                  src: ['**', '!css/app.css', '!css/normalize.css', '!css/style.css', '!js/app.js', '!js/npm.js'  ],
                  dest: 'dist/' },
              ]
            }
        },

        cssmin: {
            dist: {
                files: {
                    'app/css/style.min.css': ['app/css/style.css']
                }
            }
        },

        'http-server': {
          'dev': {
              root: './dist',
              port: 8282,
              host: '0.0.0.0',
              runInBackground: false,
              openBrowser : true,
              customPages: {
                  "/readme": "README.md"
              }
          }
        },
        
        uglify: {
            options: {
                mangle: {
                    except: ['jQuery', 'Backbone']
                }
            },
            my_target: {
                files: {
                    'app/js/app.min.js': ['app/js/app.js']
                }
            }
        },

        watch: {
            files: ['app/index.html', 'app/app.json', 'app/css/app.css', 'app/js/app.js'],
            tasks: ['uglify', 'concat', 'cssmin', 'copy']
        }


    });

    // Default task(s).
    grunt.registerTask('default', ['copy']);
    grunt.registerTask('run', ['build', 'http-server']);
    grunt.registerTask('build', ['clean:all', 'uglify', 'concat', 'cssmin', 'copy']);

};
