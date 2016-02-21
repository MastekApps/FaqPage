(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("RootCtrl", [
		"$scope", "$location", "processing","context", "$window",
		function ($scope, $location, processing, context, $window) {
			processing.initilize($scope);

			$scope.navigateToReview = function () {
			    var url = String.format("https://store.office.com/writereview.aspx?assetid={0}", context.assetId);

				$window.open(url, "_blank");
			}
		}
	]);
})();