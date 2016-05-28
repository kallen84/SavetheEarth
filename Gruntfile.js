/* parametern (grunt) är den funktion som triggas igång så fort vi
   skriver in grunt i terminalen. När grunt skrivs i, kör den här 
   funktionen */
module.exports = function(grunt) {

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    
    // Configure main projects settings
    grunt.initConfig({
        // basic setting and info about our plugins
        pkg: grunt.file.readJSON('package.json'),

    /*****  PLUGINS *****/    

    /* SASS */
    sass: {
        dist: {
            options: {
                style: 'expanded',
                sourcemap: 'none',
                precision: 2,
                update: true

            },
            files: {
                // Målfil och källfil
                'css/main.css': 'src/scss/main.scss'
            }
        }
    }, 

    /* POST CSS */
    postcss: {
        options: {
            map: false,
            proccessors: [
                require('autoprefixer')({browsers: 'last 2 versions'}),
                require('cssnano')()
            ]
        },
        dist: {
            src:'css/*.css'
        }
    },

    // /* JSCS */
    // jscs: {
    //     src: 'src/js/*.js', 
    //     options: {
    //         'preset': 'google'
    //     }
    // },

    /* UGLIFY - Minimize the JS, makes the file smaller */
    uglify: {
          options: {
              beautify: true,
              preserveComments: false,
              // gör om dubblacitattecken till enkla
              quoteStyle: 1/*, 
              compress: {
                  drop_console: true
              }*/
          },
          build: {
              files: [{
                  expand: true,
                  src: 'src/js/*.js',
                  dest: 'js/',
                  flatten: true,
                  rename: function(destBase, destPath) {
                      return destBase+destPath.replace('.js', '.min.js');
                  }
              }]
          }
    },

    // /* CONCAT */
    // concat: {
    //     options: {
    //         separator: '\n'
    //     },
    //     dist: {
    //         // Slår ihop main.js med mobile.js till filen scripts.js
    //         src: 'src/js/main.js',
    //         dest: 'src/js/scripts.js'
    //     }
    // },

    /* GROWL */
    notify_hooks: {
        options: {enabled: true, title: "KajsasRosor", success: true, duration: 3}
    },
    notify: {
        uglify: {options: {title: "KajsasRosor", message: "JSminified"} },
        sass: {options: {title: "KajsasRosor", message: "Sass compiled"} }
    },

    /* WATCH */
    watch: {
        css: {
            files: ['**/*.scss'],
            tasks: ['sass', 'postcss', 'notify:sass']
        },
        js: {
            files:['src/js/*.js'],
            // jscs för felmeddelanden 
            tasks: [/*'jscs', 'concat',*/ 'uglify', 'notify:uglify']
        },
        options: {
            nospawn: true
        }
    }

  });  
  // Runs the plugin
  grunt.registerTask('default', ['watch']);

}
