module.exports = function(grunt) {
  'use strict';
  var path = require('path');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: {
      dist: '../dist/',
      src: '../src/',
      tmp: '../tmp/',
      sass: 'sass/',
      js: 'js/',
      imgs: 'images/',
      css: 'css/'
    },

    extensions: {
      email: '*.html',
      sass: '*.scss'
    },

    hosts: {
      dev: 'http://local.dev',
      dist: 'http://liveurl.com'
    },

    watch: {
      css: {
        files: [
          '<%= paths.src %><%= paths.sass %>**/*.sass',
          '<%= paths.src %><%= paths.sass %>**/*.scss'
        ],
        tasks: ['sass']
      },
      html: {
        files: [
          '<%= paths.src %><%= extensions.email %>'
        ],
        tasks: ['premailer']
      },
      images: {
        files: [
          '<%= paths.src %><%= paths.imgs %>**/*.**'
        ],
        tasks: ['imagemin']
      },
    },

    // sass
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.src %><%= paths.sass %>',
          src: ['<%= extensions.sass %>'],
          dest: '<%= paths.dist %>',
          ext: '.css'
        }]
      }
    },

    // copy files (not used along side imagemin)
    copy: {
      images: {
        files: [{
          expand: true,
          cwd: '<%= paths.src %>',
          src: ['<%= paths.imgs %>**/**.*'],
          dest: '<%= paths.dist %>'
        }]
      }
    },

    // optimize images
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.src %>',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= paths.dist %>'
        }]
      }
    },

    // mail functions
    premailer: {
      options: {
        preserveStyles: true
      },
      simple: {
        options: {
            context: {
                PRODUCTION: true
            }
        },
        files: [{
          expand: true,
          cwd: '<%= paths.src %>',
          src: ['<%= extensions.email %>'],
          dest: '<%= paths.dist %>'
        }]
      }
    },

    // test emails
    nodemailer: {
      options: {
          /**
           * Defaults to sendmail
           * You may create a transport configuration file under `config` folder.
           * (ie: `config/nodemailer-transport.json`)
           * @see https://github.com/andris9/Nodemailer
           * note: seems to work better using smtp for larger emails
           */

          // transport: grunt.file.readJSON('config/nodemailer-transport.json'),
          message: {
              from: '<Dustin Walker> email@gmail.com'
          },

          // HTML and TXT email
          // A collection of recipients
          recipients: [{
              email: 'email@dustinwalker.com',
              name: 'Dustin Walker'
          }]
      },
      dist: {
          src: ['<%= paths.dist %>/<%= extensions.email %>']
      }
    },

  });

  // Load the Grunt plugins.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-premailer');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-nodemailer');

  // always force (prevents issues with premailer)
  grunt.option('force', true);

  // Register the default tasks.
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('testemail', ['nodemailer']);
};