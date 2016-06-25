module.exports = function(grunt) {
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Configure Grunt
  grunt.initConfig({
    //pkg: grunt.file.readJSON('package.json'),

    data: {
      ftpServer: "46.98.85.133",
      ftpPORT: 21,
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

    ftpush: {
      build: {
        auth: {
          host: '<%= data.ftpServer %>',
          port: 21,
          authKey: 'keyYuri'
        },
        src: './<%= data.ReleaseDir %>/SiteEngine/',
        dest: '/Test',
      }
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
  
  grunt.loadNpmTasks('grunt-ftpush');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');  
  

  
  grunt.registerTask('ftp_push', ['ftpush']);
  //grunt.registerTask('default', ['cssmin', 'htmlmin', 'imagemin', 'uglify', 'ftp_push']);
  //grunt.registerTask('default', ['cssmin', 'htmlmin', 'imagemin', 'ftp_push']);
  grunt.registerTask('default', ['cssmin', 'htmlmin', 'imagemin']);
  
};