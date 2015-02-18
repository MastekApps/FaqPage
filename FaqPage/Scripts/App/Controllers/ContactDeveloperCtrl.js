(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("ContactDeveloperCtrl", [
		"$scope", "processing",
		function ($scope, processing) {
			processing.initilize($scope);
		}
	]);
})();