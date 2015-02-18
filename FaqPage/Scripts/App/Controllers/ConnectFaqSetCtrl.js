(function () {
	"use strict";
	angular.module("FaqApp.controllers").controller("ConnectFaqSetCtrl", [
		"processing", "$scope", "$q", "$jq", "faqService", "context","ngToast",
		function (processing, $scope, $q, $jq, faqService, context, ngToast) {
			processing.initilize($scope);

			var wpId = context.wpId;

			$scope.viewDeferred = $q.all([faqService.faqRepository.getRootFolders(), faqService.appPartConfigRepository.getByAppPartId(wpId)]);

			$scope.viewDeferred.then(function (results) {
				$scope.folders = results[0];

				var config = results[1];
				if (config) {
					var folder = $jq.grep($scope.folders, function (currentFolder) {
						if (currentFolder.id === config.configData.folderId) return true;

						return false;
					})[0];

					folder.title = folder.title + " " + $scope.Resources.CurrentlySelected;
					$scope.folder = folder;
				} else {
					if ($scope.folders && $scope.folders.length) {
						$scope.folder = $scope.folders[0];
					}
				}
			}, function (error) {
				alert(error.message);
			});

			$scope.connectAppPart = function (folder) {
				faqService.appPartConfigRepository.getByAppPartId(wpId).then(function (config) {
					if (!config) {
						config = new AppPartConfigListItem();
						config.wpId = wpId;
						config.configData = {};
					}

					config.configData.folderId = folder.id;
					faqService.appPartConfigRepository.saveItem(config).then(function () {
						ngToast.create({
							content: $scope.Resources.DataSaved
						});

						$scope.$apply();
					}, function (error) {
						alert(error.message);
					});
				}, function (error) {
					alert(error.message);
				});
			};
		}
	]);
})();