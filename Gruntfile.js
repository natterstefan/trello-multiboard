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
            all: ['dist', 'js/app.min.js', 'css/style.css'],
            bower: ['libs/*/*', '!libs/*/dist']
        },

        concat: {
            dist_css: {
                src: ['css/app.css'],
                dest: 'css/style.css'
            }
        },

        copy: {
            dist: {
                files: {
                    "dist/.htaccess": ".htaccess",
                    "dist/index.html": "index.html",
                    "dist/main.js": "main.js",
                    "dist/app.json": "app.json",
                    "dist/css/style.min.css": "css/style.min.css",
                    "dist/css/bootstrap.min.css": "css/bootstrap.min.css",
                    "dist/css/bootstrap-theme.min.css": "css/bootstrap-theme.min.css",
                    "dist/" : "fonts/**",
                    "dist/img/trello.png": "img/trello.png",
                    "dist/img/trello_small.png": "img/trello_small.png",
                    "dist/img/trello_medium.png": "img/trello_medium.png",
                    "dist/js/app.min.js": "js/app.min.js",
                    "dist/js/bootstrap.min.js": "js/bootstrap.min.js"
                }
            }
        },

        cssmin: {
            dist: {
                files: {
                    'css/style.min.css': ['css/style.css']
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
                    'js/app.min.js': ['js/app.js']
                }
            }
        },

        watch: {
            files: ['css/app.css', 'js/app.js'],
            tasks: ['concat', 'cssmin', 'uglify']
        }


    });

    // Default task(s).
    grunt.registerTask('default', ['copy']);
    grunt.registerTask('pub', ['clean:all', 'concat', 'cssmin', 'uglify', 'copy']);

};
