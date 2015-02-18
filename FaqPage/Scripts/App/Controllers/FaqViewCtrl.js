(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("FaqViewCtrl", [
		"$scope", "$sce", "$q", "$timeout", "faqService", "processing", "context", "$log", "$window",
		function ($scope, $sce, $q, $timeout, faqService, processing, context, $log, $window) {
			processing.initilize($scope);
			var folder, resizeAttempts = 2, resizeTimeOut = 200;

			$scope.faqItems = null;
			$scope.appPartInitialized = true;

			if (context.editMode) {
				var editPageUrl = String.format("{0}FaqAppPartEditMode.aspx{1}/#/ConnectFaqSet", context.spAppWebUrl, $window.location.search);
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
				repeatScope.playingAnimation = folder.faqSetSettings.animation;
				faqItem.isShown = !faqItem.isShown;
				faqItem.expanded = !faqItem.expanded;
			}

			$scope.clearSearch = function() {
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

			$scope.resize = function () {
				$timeout(function () {
					faqService.resizeParent();
				}, 100);
			}

			faqService.appPartConfigRepository.getByAppPartId(wpId).then(function (config) {
				if (!config) {
					$scope.appPartInitialized = false;
					deferred.resolve();
					$scope.$apply();
				} else {
					faqService.faqRepository.getItemById(config.configData.folderId).then(function (loadedFolder) {
						folder = loadedFolder;
						faqService.faqRepository.folder = folder.title;
						$scope.playingAnimation = folder.faqSetSettings.animation;
						$scope.showPlusSymbol = folder.faqSetSettings.showPlusSymbol;
						$scope.forceExpand = folder.faqSetSettings.useAnimation === false;
						$scope.showSearch = folder.faqSetSettings.searchEnabled;
						
						faqService.faqRepository.getItems().then(function (items) {
							Array.forEach(items, function (item) {
								item.isShown = item.expanded;
							});
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