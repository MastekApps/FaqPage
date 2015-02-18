(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("FaqEditCtrl", [
		"$scope", "$sce", "faqService", "$location", "faqSetModel", "processing", "context",
		function ($scope, $sce, faqService, $location, faqSetModel, processing, context) {
			processing.initilize($scope);

			faqSetModel.faqSetName = "";
			$scope.faqSetModel = faqSetModel;
			$scope.wpIdProvided = !!context.wpId;

			$scope.newFaqSet = function () {
				$scope.submitted = true;
				if ($scope.faqForm.$invalid) return;

				$scope.createFolderDeferred = faqService.faqRepository.createFaqFolder(faqSetModel.faqSetName, {
					useAnimation: false,
					showPlusSymbol: true,
					animation: "cshow",
					searchEnabled: false
				});

				$scope.createFolderDeferred.then(function () {
					$scope.go(String.format("/ManageFaqSet/{0}", faqSetModel.faqSetName));
					$scope.$apply();
				}, function (error) {
					$scope.folderExists = (error.errorCode === FAQ.ErrorCodes.FolderAlreadyExists);
					$scope.illegalCharacter = (error.errorCode === FAQ.ErrorCodes.IllegalName);
					if (!$scope.folderExists && !$scope.illegalCharacter) {
						$scope.commonError = true;
						$scope.errorMessage = error.message;
					}

					$scope.$apply();
				});
			};
		}
	]);
})();