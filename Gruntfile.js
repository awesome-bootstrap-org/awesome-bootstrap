module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    clean: {
      api: {
        src: ["dist/api"],
      },
      img: {
        src: ["dist/img"],
      },
      js: {
        src: ["dist/js"],
      },
      css: {
        src: ["dist/css"],
      },
      html: {
        src: ["dist/**/*.html"],
      },
    },
    uglify: {
      options: {
        preserveComments: false,
        sourceMap: true,
      },
      build: {
        expand: true,
        cwd: "src/js",
        src: ["**/*.js"],
        dest: "dist/js",
        filter: "isFile",
      },
    },
    cssmin: {
      options: {
        mergeIntoShorthands: true,
        roundingPrecision: -1,
        sourceMap: true,
      },
      build: {
        expand: true,
        cwd: "src/css",
        src: ["*.css"],
        dest: "dist/css",
        filter: "isFile",
      },
    },
    minjson: {
      "entries-api": {
        src: ["src/api/entries/*.json"],
        dest: "dist/api/entries",
      },
    },
    copy: {
      img: {
        expand: true,
        cwd: "src/img",
        src: ["*.{png,ico,jpg,jpeg}"],
        dest: "dist/img",
        filter: "isFile",
      },
      html: {
        expand: true,
        cwd: "src/html",
        src: ["*.html", "**/*.html", "!assets/*.html"],
        dest: "dist",
        filter: "isFile",
        options: {
          process: function (content, _srcpath) {
            const assetsPath = "src/html/assets/";
            const templates = grunt.file.expand({ filter: "isFile" }, [
              `${assetsPath}*`,
            ]);
            templates.forEach((filePath) => {
              const key = filePath
                .replace(assetsPath, "")
                .replace(/\.html$/, "");
              content = content.replace(
                `{{${key}}}`,
                grunt.file.read(filePath)
              );
            });
            return content;
          },
        },
      },
    },
    watch: {
      api: {
        files: "src/api/**/*.json",
        tasks: ["api-deployment"],
        options: {
          interrupt: true,
        },
      },
      js: {
        files: "src/js/**/*.js",
        tasks: ["js-deployment"],
        options: {
          interrupt: true,
        },
      },
      css: {
        files: "src/css/**/*.css",
        tasks: ["css-deployment"],
        options: {
          interrupt: true,
        },
      },
      img: {
        files: "src/img/**/*.{png,ico,jpg,jpeg}",
        tasks: ["img-deployment"],
        options: {
          interrupt: true,
        },
      },
      html: {
        files: "src/html/**/*.html",
        tasks: ["html-deployment"],
        options: {
          interrupt: true,
        },
      },
    },
    concurrent: {
      options: {
        logConcurrentOutput: true,
      },
      api: {
        tasks: ["minjson:entries-api"],
      },
      build: {
        tasks: [
          "js-deployment",
          "css-deployment",
          "html-deployment",
          "api-deployment",
          "img-deployment",
        ],
      },
      watch: {
        tasks: [
          "watch:api",
          "watch:js",
          "watch:css",
          "watch:img",
          "watch:html",
        ],
      },
    },
  });

  grunt.loadNpmTasks("grunt-minjson");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-cssmin");

  grunt.registerTask("default", ["build"]);
  grunt.registerTask("build", ["concurrent:build"]);
  grunt.registerTask("dev", ["concurrent:watch"]);
  grunt.registerTask("api-deployment", ["clean:api", "concurrent:api"]);
  grunt.registerTask("img-deployment", ["clean:img", "copy:img"]);
  grunt.registerTask("html-deployment", ["clean:html", "copy:html"]);
  grunt.registerTask("js-deployment", ["clean:js", "uglify"]);
  grunt.registerTask("css-deployment", ["clean:css", "cssmin"]);
};
