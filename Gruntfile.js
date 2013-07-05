module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jslint: {
            files: [
                'src/**/*.js'
            ]
        },
        jasmine : {
            src : 'src/**/*.js',
            options : {
                helpers : 'helper/**/*.js',
                specs : 'spec/**/*.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('test', ['jslint', 'jasmine']);

    grunt.registerTask('default', ['test']);

};
