module.exports = function(grunt) {
// Load Grunt tasks declared in the package.json file
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

// Configure Grunt
grunt.initConfig({

// Grunt express - our webserver
// https://github.com/blai/grunt-express
//express: {
//    all: {
//        options: {
//            //bases: ['C:\\inetpub\\wwwroot\\test'],
//			bases: ['C:\\Program Files\\nodejs\\SiteEngine\\Client'],
//            port: 8083,
//            hostname: "0.0.0.0",
//            livereload: true
//        }
//    }
//},

//// grunt-watch will monitor the projects files
//// https://github.com/gruntjs/grunt-contrib-watch
  watch: {
    livereload: {
      options: { livereload: true },
      //files: ['**/*.js'],
      files: ['./SiteEngine/Client/**/*'],
    },
  },

  // grunt-open will open your browser at the project's URL
  // https://www.npmjs.org/package/grunt-open
  open: {
      all: {
          //path: 'http://localhost:8080/index.html'
        path: 'http://localhost:8082/siteEngine/Client/index.html#/Views/start'
        //path: 'http://localhost:55207/index.html#/Views/start'
      }
  }

});

// Creates the `server` task
grunt.registerTask('server', [
    //'express',
    'open',
    'watch'
    ]);
};