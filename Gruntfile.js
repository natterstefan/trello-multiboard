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
                files: {
                    "dist/.htaccess": "app/.htaccess",
                    "dist/index.html": "app/index.html",
                    "dist/main.js": "app/main.js",
                    "dist/app.json": "app.json",
                    "dist/css/style.min.css": "app/css/style.min.css",
                    "dist/css/bootstrap.min.css": "app/css/bootstrap.min.css",
                    "dist/css/bootstrap-theme.min.css": "app/css/bootstrap-theme.min.css",
                    "dist/fonts/" : "app/fonts/**",
                    "dist/img/trello.png": "app/img/trello.png",
                    "dist/img/trello_small.png": "app/img/trello_small.png",
                    "dist/img/trello_medium.png": "app/img/trello_medium.png",
                    "dist/js/app.min.js": "app/js/app.min.js",
                    "dist/js/bootstrap.min.js": "app/js/bootstrap.min.js"
                }
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
