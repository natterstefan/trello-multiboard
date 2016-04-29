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
                src: ['app/css/app.css'],
                dest: 'app/css/style.css'
            }
        },

        copy: {
            dist: {
              files: [
                // makes all src relative to cwd
                {expand: true, cwd: 'app/', src: ['**'], dest: 'dist/'},

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

        meta: {
            version: '0.0.2',
            banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* http://PROJECT_WEBSITE/\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            'YOUR_NAME; Licensed MIT */'
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
            files: ['app/css/app.css', 'app/js/app.js'],
            tasks: ['concat', 'cssmin', 'uglify']
        }


    });

    // Default task(s).
    grunt.registerTask('default', ['copy']);
    grunt.registerTask('build', ['clean:all', 'concat', 'cssmin', 'uglify', 'copy']);

};
