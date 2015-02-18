(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("LicensingCtrl", [
		"$scope", "faqService", "$location", "$q", "processing", "licenseStatus", "licensing",
		function ($scope, faqService, $location, $q, processing, licenseStatus, licensing) {
			processing.initilize($scope);

			$scope.lockDeferred = licensing.getLicenseStatus();

			$scope.showIfLicenseValid = function() {
				return $scope.licensed || $scope.underTrial || $location.path() === "/Licensing";
			};

			$scope.isAppPart = window.parent !== window;

			$scope.lockDeferred.then(function (license) {
				$scope.underTrial = license.status === licenseStatus.UnderTrial;
				$scope.licensed = license.status === licenseStatus.Licensed;
				$scope.trialExpired = license.status === licenseStatus.TrialExpired;
				$scope.licenseNotValid = license.status === licenseStatus.LicenseNotValid;
				$scope.daysLeft = license.daysLeft;
			}, function(error) {
				alert(error);
			});
		}
	]);
})();