(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("FaqViewCtrl", [
		"$scope", "$sce", "$q", "$timeout", "faqService", "processing", "context", "$log", "$window", "$jq",
		function ($scope, $sce, $q, $timeout, faqService, processing, context, $log, $window, $jq) {
			processing.initilize($scope);
			var resizeAttempts = 2, resizeTimeOut = 200;

			$scope.selectedFolders = {};
			$scope.selectedFolders.folders = [];
			$scope.faqItems = null;
			$scope.appPartInitialized = true;

			if (context.editMode) {
				var editPageUrl = String.format("{0}FaqAppPartEditMode.aspx{1}#/ConnectFaqSet", context.spAppWebUrl, $window.location.search);
				$log.debug(editPageUrl);
				$window.location.href = editPageUrl;
				return;
			}

			var wpId = context.wpId;

			var deferred = $q.defer();
			$scope.viewDeferred = deferred.promise;

			$scope.changeVisibility = function (faqItem, repeatScope) {
				if ($scope.forceExpand) {
					return;
				}
				repeatScope.playingAnimation = repeatScope.$parent.faqFolder.faqSetSettings.animation;
				faqItem.isShown = !faqItem.isShown;
				faqItem.expanded = !faqItem.expanded;
			}

			$scope.clearSearch = function () {
				if (!$scope.searchText) {
					return;
				}
				$scope.searchText = "";
				$timeout(function () {
					faqService.resizeParent();
				}, 100);
			}

			$scope.filterByQuestionAnswer = function (faq) {
				if (!$scope.searchText) {
					return true;
				}
				var toSearch = $scope.searchText.toLowerCase();
				return faq.question.toLowerCase().indexOf(toSearch) !== -1 || faq.answer.toLowerCase().indexOf(toSearch) !== -1;
			}

			$scope.filterBySelectedFolders = function (folder) {
				if ($scope.selectedFolders.folders.length === 0) {
					return true;
				}

				var filteredFolder = $jq.grep($scope.selectedFolders.folders, function(searchFolder) {
					return folder.id === searchFolder.id;
				});

				return filteredFolder.length === 1;
			}

			$scope.resize = function () {
				$timeout(function () {
					faqService.resizeParent();
				}, 100);
			}

			$scope.initScope = function (faqFolder, $repeatScope) {
				$repeatScope.playingAnimation = faqFolder.faqSetSettings.animation;
				$repeatScope.showPlusSymbol = faqFolder.faqSetSettings.showPlusSymbol;
				$repeatScope.forceExpand = faqFolder.faqSetSettings.useAnimation === false;
			}

			faqService.appPartConfigRepository.getByAppPartId(wpId).then(function (config) {
				if (!config) {
					$scope.appPartInitialized = false;
					deferred.resolve();
					$scope.$apply();
				} else {
					//fix for 1.0.1.2 version
					if (config.configData.folderId) {
						config.configData.faqSetInfo = [];
						config.configData.faqSetInfo.push({
							order: 1,
							folderId: config.configData.folderId
						});
					}
					//end fix
					faqService.faqRepository.getItemsByIds(config.configData.faqSetInfo.map(function (info) {
						return info.folderId;
					})).then(function (loadedFolders) {

						$log.debug(loadedFolders);

						faqService.faqRepository.getItemsInsideFolders(loadedFolders.map(function (folder) {
							return folder.title;
						})).then(function (items) {

							$log.debug(items);

							Array.forEach(items, function (item) {
								item.isShown = item.expanded;
							});

							Array.forEach(loadedFolders, function (currentFolder) {
								var folderItems = $jq.grep(items, function (faqItem) {
									if (faqItem.fileDirRef.indexOf(currentFolder.title) !== -1) {
										return true;
									}

									return false;
								});

								var configFolder = $jq.grep(config.configData.faqSetInfo, function (info) {
									if (info.folderId === currentFolder.id) {
										return true;
									}
									return false;
								})[0];

								currentFolder.faqItems = folderItems;
								currentFolder.order = configFolder.order;
							});

							$scope.showSearch = config.configData.searchEnabled;
							$scope.showFilter = config.configData.filterEnabled;
							$scope.loadedFolders = loadedFolders;

							$scope.faqItems = items;
							deferred.resolve();

							$scope.$apply();

							faqService.resizeParent();
							$log.debug("faqService.resizeParent()");

							var resizeInterval = setInterval(function () {
								resizeAttempts--;
								if (resizeAttempts === 0) {
									clearInterval(resizeInterval);
								}
								faqService.resizeParent();
								$log.debug("faqService.resizeParent() - interval");
							}, 1 * resizeTimeOut);
						}, function (error) {
							deferred.resolve();
							alert(error.message);
						});
					}, function (error) {
						deferred.resolve();
						alert(error.message);
					});
				}
			}, function (error) {
				deferred.resolve();
				alert(error.message);
			});
		}
	]);
})();