(function () {
	"use strict";

	angular.module("FaqApp.controllers").
		controller("ManageFaqSetCtrl", [
			"$scope", "$sce", "faqService", "$location", "faqSetModel", "processing", "$modal", "$routeParams",
			function ($scope, $sce, faqService, $location, faqSetModel, processing, $modal, $routeParams) {
				processing.initilize($scope);
				
				faqSetModel.faqSetName = $routeParams.folderUrl;
				$scope.faqSetModel = faqSetModel;
				$scope.activeTab = "tab1";
				faqService.faqRepository.folder = $routeParams.folderUrl;

				$scope.viewDeferred = faqService.faqRepository.getOrderedItems();
				$scope.viewDeferred.then(function (items) {
					Array.forEach(items, function (item) {
						item.isShown = item.expanded;
					});
					$scope.faqItems = items;
					$scope.$apply();
				}, function (error) {
					alert(error.message);
				});

				$scope.newFaq = function () {
					$scope.go(String.format("/ManageFaqSet/{0}/faq/new", $routeParams.folderUrl));
				};

				$scope.editFaq = function (faqItem) {
					$scope.go(String.format("/ManageFaqSet/{0}/faq/edit/{1}", $routeParams.folderUrl, faqItem.id));
				};

				$scope.deleteFaq = function (faqItem) {
					var modalInstance = $modal.open({
						templateUrl: "deleteFaqModal.html",
						controller: "ModalInstanceCtrl",
						size: "sm"
					});
					modalInstance.result.then(function () {
						$scope.viewDeferred = faqService.faqRepository.deleteItem(faqItem);
						$scope.viewDeferred.then(function () {
							var indexToRemove = -1;
							Array.forEach($scope.faqItems, function (item, index) {
								if (item.id === faqItem.id) {
									indexToRemove = index;
									return;
								}
							});
							if (indexToRemove > -1) {
								$scope.faqItems.splice(indexToRemove, 1);
							}

							$scope.$apply();
						}, function (error) {
							alert(error.message);
						});
					}, function () { });
				};

				$scope.sortableOptions = {
					placeholder: "sortable-placeholder",
					stop: function () {
						Array.forEach($scope.faqItems, function (item, index) {
							item.order = index;
						});

						$scope.viewDeferred = faqService.faqRepository.updateOrdering($scope.faqItems);
						$scope.viewDeferred.then(function () {

						}, function (error) {
							alert(error.message);
						});
					}
				};
			}
		]);
})();