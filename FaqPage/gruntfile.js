// This file in the main entry point for defining grunt tasks and using grunt plugins.
// Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409

module.exports = function (grunt) {

	var baseExternalPath = "Scripts/AppExternal";

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
			options: {
				sourceMap: true
			},

			dev: {
				files: {
					"Scripts/External/faq.app.external.min.js": [baseExternalPath + "/jquery/jquery.js",
																baseExternalPath + "/jquery-ui/jquery-ui.js",
																baseExternalPath + "/blockui/jquery.blockUI.js",
																baseExternalPath + "/camljs/index.js",
																baseExternalPath + "/angular/angular.js",
																baseExternalPath + "/angular-route/angular-route.js",
																baseExternalPath + "/angular-animate/angular-animate.js",
																baseExternalPath + "/angular-sanitize/angular-sanitize.js",
																baseExternalPath + "/angular-ui-sortable/sortable.js",
																baseExternalPath + "/bootstrap/bootstrap.js",
																baseExternalPath + "/angular-bootstrap/ui-bootstrap-tpls.js",
																baseExternalPath + "/ngtoast/ngToast.js",
																baseExternalPath + "/jsencrypt/jsencrypt.min.js",
																baseExternalPath + "/moment/moment.js"]
				}
			}
		}
	});

	grunt.registerTask("default", ["bower:install", "uglify"]);

	// The following line loads the grunt plugins.
	// This line needs to be at the end of this this file.
	grunt.loadNpmTasks("grunt-bower-task");
	grunt.loadNpmTasks("grunt-contrib-uglify");
};