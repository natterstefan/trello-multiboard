'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

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
                { expand: true, cwd: 'app/', src: ['**'], dest: 'dist/' },
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
    grunt.registerTask('build', ['clean:all', 'uglify', 'concat', 'cssmin', 'copy']);

};
