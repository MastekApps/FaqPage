/// <vs SolutionOpened='watch' />
// This file in the main entry point for defining grunt tasks and using grunt plugins.
// Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409

module.exports = function (grunt) {

	var scriptsPath = "Scripts";
	var baseExternalPath = scriptsPath + "/AppExternal";
	var baseCorePath = scriptsPath + "/Core";
	var appPath = scriptsPath + "/App";

	var externalFiles = [
		baseExternalPath + "/jquery/*.js",
		baseExternalPath + "/jquery-ui/*.js",
		baseExternalPath + "/blockui/*.js",
		baseExternalPath + "/camljs/*.js",
		baseExternalPath + "/angular/*.js",
		baseExternalPath + "/angular-route/*.js",
		baseExternalPath + "/angular-animate/*.js",
		baseExternalPath + "/angular-sanitize/*.js",
		baseExternalPath + "/angular-ui-sortable/*.js",
		baseExternalPath + "/angular-ui-select/*.js",
		baseExternalPath + "/angular-sortable-view/*.js",
		baseExternalPath + "/bootstrap/js/bootstrap.js",
		baseExternalPath + "/angular-bootstrap/*.js",
		baseExternalPath + "/ngtoast/*.js",
		baseExternalPath + "/jsencrypt/*.js",
		baseExternalPath + "/moment/*.js"
	];

	var coreFiles = [
		baseCorePath + "/Constants.js",
		baseCorePath + "/RequestError.js",
		baseCorePath + "/ListService.js",
		baseCorePath + "/Repositories/Base/*.js",
		baseCorePath + "/Repositories/*.js",
		baseCorePath + "/Repositories/Entities/*.js",
		baseCorePath + "/Common/SPWebService.js"
	];

	var appFiles = [
		appPath + "/app.js",
		appPath + "/Controllers/*.js",
		appPath + "/Directives/*.js",
		appPath + "/Filters/*.js",
		appPath + "/Services/*.js"
	];

	var appScriptsSource = "Scripts/build/faq.app.min.js";
	var coreScriptsSource = "Scripts/build/faq.app.core.min.js";
	var externalScriptsSource = "Scripts/build/faq.app.external.min.js";

	grunt.initConfig({

		bower: {
			install: {
				options: {
					targetDir: baseExternalPath,
					cleanup: true,
					layout: "byComponent"
				}
			}
		},

		uglify: {
			debug: {
				options: {
					sourceMap: true,
					mangle: false,
					preserveComments: "all"
				},

				files: [
					{ src: externalFiles, dest: externalScriptsSource },
					{ src: coreFiles, dest: coreScriptsSource },
					{ src: appFiles, dest: appScriptsSource }
				]
			},
			release: {
				options: {
					sourceMap: false
				},

				files: [
					{ src: externalFiles, dest: externalScriptsSource },
					{ src: coreFiles, dest: coreScriptsSource },
					{ src: appFiles, dest: appScriptsSource }
				]
			},
			appOnly: {
				options: {
					sourceMap: true,
					mangle: false,
					preserveComments: "all"
				},

				files: [
					{ src: appFiles, dest: appScriptsSource },
					{ src: coreFiles, dest: coreScriptsSource }
				]
			}
		},

		sass: {
			options: {

			},
			main: {
				files: [{
					expand: true, // Recursive
					cwd: "Content/Css", // The startup directory
					src: ["**/*.scss"], // Source files
					dest: "Content/Css", // Destination
					ext: ".css" // File extension 
				}]
			}
		},

		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1,
				sourceMap: true
			},
			main: {
				files: {
					"Content/css/faq.app.css": [
					"Content/css/app/**/*.css",
					"Scripts/AppExternal/bootstrap/css/bootstrap.css",
					"Scripts/AppExternal/animate.css/animate.css",
					"Scripts/AppExternal/font-awesome/font-awesome.css",
					"Scripts/AppExternal/ngtoast/ngtoast.css",
					"Scripts/AppExternal/angular-ui-select/*.css",
					"Content/css/external/jquery-ui-1.10.4.custom.min"
					]
				}
			}
		},

		copy: {
			main: {
				files: [
				  { expand: true, cwd: "Scripts/AppExternal/font-awesome", src: ["**", "!*.css"], dest: "Content/fonts" },
				  { expand: true, cwd: "Scripts/AppExternal/bootstrap/fonts", src: ["**"], dest: "Content/fonts" }
				]
			}
		},
		updateAppInfo: {
			debug: {},
			release: {}
		},

		watch: {
			scripts: {
				files: ["Scripts/App/**/*.js", "Scripts/Core/**/*.js"],
				tasks: ["uglify:appOnly"],
				options: {
					spawn: false
				}
			},
			css: {
				files: "Content/css/**/*.scss",
				tasks: ["sass:main", "cssmin:main"],
				options: {
					
				}
			}
		}
	});

	grunt.registerTask("debug", ["updateAppInfo:debug", "uglify:appOnly", "sass:main", "cssmin:main", "copy:main"]);
	grunt.registerTask("release", ["updateAppInfo:release", "uglify:release", "sass:main", "cssmin:main", "copy:main"]);

	// The following line loads the grunt plugins.
	// This line needs to be at the end of this this file.
	grunt.loadNpmTasks("grunt-bower-task");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-sass");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-watch");

	//custom tasks
	grunt.loadTasks("tasks");
};