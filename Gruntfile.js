module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    compress: true,
                    optimization: 2
                },
                files: {
                    // target.css file: source.less file
                    "css/visor_style.min.css": "css/visor_style.less"
                }
            }
        },
        uglify: {
            js: {
                files: {
                    'js/jquery.cavisor.min.js': ['js/jquery.cavisor.js']
                }
            }
        },
        watch: {
            js: {
                files: ['js/jquery.cavisor.js'],
                tasks: ['uglify:js'],
                options: {
                    livereload: true,
                }
            },
            styles: {
                files: ['css/visor_style.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['uglify:js']);
};