/// <vs />
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
		baseExternalPath + "/bootstrap/*.js",
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
					sourceMap: true
				},

				files: {
					"Scripts/External/faq.app.external.min.js": externalFiles,
					"Scripts/Core/faq.app.core.min.js": coreFiles,
					"Scripts/App/faq.app.min.js": appFiles
				}
			},
			release: {
				options: {
					sourceMap: false
				},

				files: {
					"Scripts/External/faq.app.external.min.js": externalFiles,
					"Scripts/Core/faq.app.core.min.js": coreFiles,
					"Scripts/App/faq.app.min.js": appFiles
				}
			},
			appOnly: {
				options: {
					sourceMap: true
				},

				files: {
					"Scripts/Core/faq.app.core.min.js": coreFiles,
					"Scripts/App/faq.app.min.js": appFiles
				}
			}
		}
	});

	grunt.registerTask("debug", ["bower:install", "uglify:debug"]);
	grunt.registerTask("release", ["bower:install", "uglify:release"]);

	// The following line loads the grunt plugins.
	// This line needs to be at the end of this this file.
	grunt.loadNpmTasks("grunt-bower-task");
	grunt.loadNpmTasks("grunt-contrib-uglify");
};