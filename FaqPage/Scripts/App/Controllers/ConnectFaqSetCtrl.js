(function () {
	"use strict";
	angular.module("FaqApp.controllers").controller("ConnectFaqSetCtrl", [
		"processing", "$scope", "$q", "$jq", "faqService", "context","ngToast", "$timeout",
		function (processing, $scope, $q, $jq, faqService, context, ngToast, $timeout) {
			processing.initilize($scope);

			var wpId = context.wpId;

			$scope.resize = function () {
				$timeout(function () {
					faqService.resizeParent();
				}, 100);
			}

			$scope.selectedFolders = [];
			$scope.viewDeferred = $q.all([faqService.faqRepository.getRootFolders(), faqService.appPartConfigRepository.getByAppPartId(wpId)]);

			$scope.viewDeferred.then(function (results) {
				var folders = results[0];
				var config = results[1];

				if (config) {
					$scope.searchEnabled = config.configData.searchEnabled;
					$scope.filterEnabled = config.configData.filterEnabled;
					$scope.customCssEnabled = config.configData.customCssEnabled;
					$scope.customCssLink = config.configData.customCssLink;
					//fix for 1.0.1.2 version
					if (config.configData.folderId) {
						config.configData.faqSetInfo = [];
						config.configData.faqSetInfo.push({
							order: 1,
							folderId: config.configData.folderId
						});
					}
					//end fix

					Array.forEach(config.configData.faqSetInfo, function(info) {
						var sourceIndex = folders.map(function(folder) {
							return folder.id;
						}).indexOf(info.folderId);

						if (sourceIndex !== -1) {
							var splicedFolder = folders.splice(sourceIndex, 1)[0];
							splicedFolder.order = info.order;
							$scope.selectedFolders.push(splicedFolder);
						}
					});
				} else {
					$scope.customCssLink = context.spAppWebUrl + "Lists/Documents/FaqCustomStyles.css";
				}

				$scope.selectedFolders.sort(function(a, b) {
					return a.order - b.order;
				});

				$scope.folders = folders;
				$scope.resize();
			}, function (error) {
				alert(error.message);
			});

			$scope.connectAppPart = function () {
				faqService.appPartConfigRepository.getByAppPartId(wpId).then(function (config) {
					if (!config) {
						config = new AppPartConfigListItem();
						config.wpId = wpId;
						config.configData = {};
					}

					var faqSetInfo = $scope.selectedFolders.map(function(selectedFolder, index) {
						return {
							order: index,
							folderId: selectedFolder.id
						}
					});

					//fix for 1.0.1.2 version
					if (config.configData.folderId) {
						delete config.configData.folderId;
					}
					//end fix

					config.configData.faqSetInfo = faqSetInfo;
					config.configData.searchEnabled = $scope.searchEnabled;
					config.configData.filterEnabled = $scope.filterEnabled;
					config.configData.customCssEnabled = $scope.customCssEnabled;
					config.configData.customCssLink = $scope.customCssLink;

					faqService.appPartConfigRepository.saveItem(config).then(function () {
						ngToast.create({
							content: $scope.Resources.DataSaved,
							horizontalPosition: "center",
							verticalPosition: "bottom"
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