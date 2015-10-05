module.exports = function(grunt) {
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Configure Grunt
  grunt.initConfig({
    //pkg: grunt.file.readJSON('package.json'),

    data: {
      DevDir: "SiteEngine_WebStorm",
      ReleaseDir: "SiteEngine_RELEASE"
    },

    //jshint: {
    //  files: ['Gruntfile.js', './SiteEngine_WebStorm/SiteEngine/Server/**/*.js'],
    //  options: {
    //    // options here to override JSHint defaults
    //    globals: {
    //      jQuery: true,
    //      console: true,
    //      module: true,
    //      document: true
    //    }
    //  }
    //},

    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            cwd: './SiteEngine_RELEASE/SiteEngine/',
            src: ['**'],
            dest: './SiteEngine_RELEASE/Test/',
            filter: 'isFile'
          },

          //// includes files within path and its sub-directories
          //{ expand: true, src: ['path/**'], dest: 'dest/' },

          //// makes all src relative to cwd
          //{ expand: true, cwd: 'path/', src: ['**'], dest: 'dest/' },

          //// flattens results to a single level
          //{ expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile' },
        ],
      },
    },

    uglify: {
      my_target: {
        options: {
          sourceMap: true,
          sourceMapName: 'path/to/sourcemap.map'
        },
        files: [{
            expand: true,
            cwd: './<%= data.DevDir %>/SiteEngine/',
            src: ['**/*.js'],
            dest: './<%= data.ReleaseDir %>/SiteEngine/',
          }, {
            './<%= data.ReleaseDir %>/SiteEngine/Common/appConfig.js': ['./<%= data.DevDir %>/SiteEngine/Common/appConfig_RELEASE.js']
        }]
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd:  './<%= data.DevDir %>/SiteEngine/',
          //src: ['**/*.css', '**/!*.min.css'],
          src: ['**/*.css'],
          dest: './<%= data.ReleaseDir %>/SiteEngine/',
          //ext: '.css'
        }]
      }
    },

    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: './<%= data.DevDir %>/SiteEngine/',
          src: ['**/*.html'],
          dest: './<%= data.ReleaseDir %>/SiteEngine/',
        }]
      },
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 5
        },
        files: [{
          expand: true,
          cwd: './<%= data.DevDir %>/SiteEngine/',
          src: ['**/*.{png,jpg,jpeg,gif}'],
          dest: './<%= data.ReleaseDir %>/SiteEngine/',
        }]
      }
    }

  });

  grunt.registerTask('install', 'install the backend and frontend dependencies', function () {
    // adapted from http://www.dzone.com/snippets/execute-unix-command-nodejs
    var exec = require('child_process').exec,
        sys = require('sys');

    function puts(error, stdout, stderr) { console.log(stdout); sys.puts(stdout) }

    // assuming this command is run from the root of the repo
    exec('npm install', { cwd: './SiteEngine_RELEASE'}, puts);
  });


  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');  
  

  //grunt.registerTask('default', ['cssmin', 'htmlmin', 'imagemin', 'uglify']);
  //grunt.registerTask('default', ['cssmin', 'htmlmin', 'imagemin']);
  grunt.registerTask('default', ['copy']);
  
};