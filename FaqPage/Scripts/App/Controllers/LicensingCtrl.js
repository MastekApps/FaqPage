(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("LicensingCtrl", [
		"$scope", "faqService", "$location", "$q", "processing", "licenseStatus", "licensing", "context", "$window",
		function ($scope, faqService, $location, $q, processing, licenseStatus, licensing, context, $window) {
			processing.initilize($scope);
			$scope.lockDeferred = licensing.getLicenseStatus();

			$scope.isAppPart = window.parent !== window;

			$scope.showIfLicenseValid = function () {
				return $scope.licensed || $scope.underTrial;
			};

			$scope.lockDeferred.then(function (license) {
				$scope.underTrial = license.status === licenseStatus.UnderTrial;
				$scope.licensed = license.status === licenseStatus.Licensed;
				$scope.trialExpired = license.status === licenseStatus.TrialExpired;
				$scope.licenseNotValid = license.status === licenseStatus.LicenseNotValid;
				$scope.daysLeft = license.daysLeft;
				$scope.assetId = license.assetId;
			}, function (error) {
				$scope.licenseNotValid = true;
				alert(error.message);
			});

			$scope.navigateToBuy = function () {
				var url = String.format("{0}_layouts/15/storefront.aspx?source={1}#vw=AppDetailsView,app={2},clg=0,bm=US,cm=en-US",
					context.spHostUrl, encodeURIComponent($window.location.href), $scope.assetId);

				if ($scope.isAppPart) {
					$window.open(url,"_blank");
				} else {
					$window.location.href = url;
				}
			}

			$scope.navigateToReview = function () {
				var url = String.format("https://store.office.com/writereview.aspx?assetid={0}", $scope.assetId);

				if ($scope.isAppPart) {
					$window.open(url, "_blank");
				} else {
					$window.location.href = url;
				}
			}
		}
	]);
})();