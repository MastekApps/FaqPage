(function () {
	"use strict";

	angular.module("FaqApp.controllers").
		controller("CommonFaqSetSettingsCtrl", [
			"$scope", "faqService", "processing", "$routeParams", "$timeout", "$jq", "animationList", "ngToast",
			function ($scope, faqService, processing, $routeParams, $timeout, $jq, animationList, ngToast) {
				processing.initilize($scope);
				var folder;

				$scope.viewDeferred = faqService.faqRepository.getRootFolders();

				$scope.viewDeferred.then(function(folders) {
					folder = $jq.grep(folders, function (currentFolder) {
						if (currentFolder.title === $routeParams.folderUrl) return true;

						return false;
					})[0];

					$scope.faqSettings = folder.faqSetSettings;
					$scope.setSelectedAnimation($scope.faqSettings.animation);
				});

				$scope.setSelectedAnimation = function (name) {
					$scope.selectedAnimation = animationList[name];
					$scope.playingAnimation = name;
					$scope.faqSettings.animation = name;
				}

				$scope.testAnimation = function () {
					$scope.playingAnimation = $scope.faqSettings.animation;
				};

				$scope.saveSettings = function () {
					folder.faqSetSettings = $scope.faqSettings;
					$scope.viewDeferred = faqService.faqRepository.saveItem(folder);
					ngToast.create({
						content: $scope.Resources.DataSaved
					});
				};
			}
		]);
})();