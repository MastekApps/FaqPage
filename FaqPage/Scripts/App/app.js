(function () {
	"use strict";

	angular.module("FaqApp.controllers", []);
	angular.module("FaqApp.services", []);
	angular.module("FaqApp.directives", []);
	angular.module("FaqApp.filters", []);

	angular.module("ViewFaqApp", [
		"FaqApp.controllers",
		"FaqApp.services",
		"FaqApp.directives",
		"FaqApp.filters",
		"ngRoute",
		"ngSanitize",
		"ngAnimate",
		"ui.bootstrap",
		"ui.sortable"
	]).
	config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
			when("/", { templateUrl: "partials/FaqList.html", controller: "FaqViewCtrl" }).
			otherwise({ redirectTo: "/" });
	}]).config(["$logProvider", function ($logProvider) {
		$logProvider.debugEnabled(window.faq_is_debug);
	}]);;

	angular.module("EditFaqApp", [
		"FaqApp.controllers",
		"FaqApp.services",
		"FaqApp.directives",
		"ngRoute",
		"ngSanitize",
		"ngAnimate",
		"ui.bootstrap",
		"ui.sortable",
		"ngToast"
	]).
	config(["$routeProvider", function ($routeProvider) {
		$routeProvider.
			when("/", { templateUrl: "partials/EditMode/FaqEditStartScreen.html", controller: "FaqEditCtrl" }).
			when("/SelectForEdit", { templateUrl: "partials/EditMode/SelectFaqSetForEdit.html", controller: "SelectFaqForEditCtrl" }).
			when("/ConnectFaqSet", { templateUrl: "partials/EditMode/ConnectFaqSet.html", controller: "ConnectFaqSetCtrl" }).
			when("/NewFaqSet", { templateUrl: "partials/EditMode/NewFaqSet.html", controller: "FaqEditCtrl" }).
			when("/ManageFaqSet/:folderUrl", { templateUrl: "partials/EditMode/ManageFaqSet.html", controller: "ManageFaqSetCtrl" }).
			when("/ManageFaqSet/:folderUrl/faq/edit/:faqId", { templateUrl: "partials/EditMode/CreateEditFaq.html", controller: "CreateEditFaqCtrl" }).
			when("/ManageFaqSet/:folderUrl/faq/new", { templateUrl: "partials/EditMode/CreateEditFaq.html", controller: "CreateEditFaqCtrl" }).
			when("/Licensing", { templateUrl: "partials/EditMode/LicenseRequest.html", controller: "RegisterAppCtrl" }).
			when("/ContactDev", { templateUrl: "partials/EditMode/ContactDeveloper.html", controller: "ContactDeveloperCtrl" }).
			otherwise({ redirectTo: "/" });
	}]).config(["$logProvider", function ($logProvider) {
		$logProvider.debugEnabled(window.faq_is_debug);
	}]);
})();