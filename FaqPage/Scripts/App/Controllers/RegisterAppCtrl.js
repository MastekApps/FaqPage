(function () {
	"use strict";

	angular.module("FaqApp.controllers").
		controller("RegisterAppCtrl", [
			"$scope", "faqService", "processing", "$q", "$window", "ngToast", "licenseStatus", "licensing",
			function ($scope, faqService, processing, $q, $window, ngToast, licenseStatus, licensing) {
				processing.initilize($scope);

				$scope.lockDeferred = $q.defer();

				licensing.getLicenseStatus().then(function (license) {
					$scope.underTrial = license.status === licenseStatus.UnderTrial;
					$scope.licensed = license.status === licenseStatus.Licensed;
					$scope.trialExpired = license.status === licenseStatus.TrialExpired;
					$scope.licenseNotValid = license.status === licenseStatus.LicenseNotValid;
					$scope.licenseKey = license.licenseKey;

					faqService.webService.getHostWebId().then(function (webId) {
						$scope.hostWebId = webId;
						$scope.lockDeferred.resolve();
						$scope.$apply();
					}, function (error) {
						$scope.lockDeferred.reject();
						alert(error);
					});
				}, function (error) {
					$scope.lockDeferred.reject();
					alert(error);
				});

				$scope.applyLicense = function () {
					licensing.setLicense($scope.licenseKey).then(function () {
						ngToast.create({
							content: $scope.Resources.LicenseApplied
						});
						$scope.$apply();
						setTimeout(function() {
							$window.location.reload();
						}, 1 * 1000);
					}, function(error) {
						alert(error);
					});
				}
			}
		]);
})();