(function () {
	"use strict";

	angular.module("FaqApp.controllers").
		controller("CreateEditFaqCtrl", [
			"$scope", "$sce", "$routeParams", "$q", "faqService", "processing","ngToast",
			function ($scope, $sce, $routeParams, $q, faqService, processing, ngToast) {
				processing.initilize($scope);

				var faqItem;
				faqService.faqRepository.folder = $routeParams.folderUrl;

				//edit mode
				if ($routeParams.faqId) {
					//if item is not requested yet
					faqService.faqRepository.getItemById(parseInt($routeParams.faqId, 10)).then(function (item) {
						faqItem = item;
						initModel();
						$scope.$apply();
					}, function (error) {
						alert(error.message);
					});
				} else { // new mode
					faqItem = new FaqListItem();
					faqItem.expanded = true;
					initModel();
				}

				function initModel() {
					$scope.faqItem = faqItem;

					$scope.$watch("faqItem.question", function () {
						$scope.question = $scope.getInnerText(faqItem.question);
					});
					$scope.$watch("faqItem.answer", function () {
						$scope.answer = $scope.getInnerText(faqItem.answer);
					});

					$scope.saveFaq = function () {
						$scope.submitted = true;
						if ($scope.faqForm.$invalid) return;

						var deferred = $q.defer();
						$scope.viewDeferred = deferred.promise;
						faqService.faqRepository.getLastItem().then(function (item) {
							if (!faqItem.order) {
								faqItem.order = item ? item.id + 1 : 1;
							}
							faqService.faqRepository.saveItem(faqItem).then(function () {
								ngToast.create({
									content: $scope.Resources.QuestionSaved
								});
								deferred.resolve();
								$scope.go(String.format("/ManageFaqSet/{0}", $routeParams.folderUrl));
							}, function (error) {
								deferred.resolve();
								alert(error.message);
							});
						}, function (error) {
							deferred.resolve();
							alert(error.message);
						});
					};

					$scope.back = function () {
						$scope.go(String.format("/ManageFaqSet/{0}", $routeParams.folderUrl));
					};
				}
			}
		]);
})();