(function($) {
    "use strict";

    angular.module("FaqApp.services").
	factory("processing", ["$sce", "$location", "faqService",
	function ($sce, $location, faqService) {
		return {
			initilize: function ($scope) {
				$scope.Resources = FAQRS;
				$scope.trustedHtml = function (input) {
					return $sce.trustAsHtml(input);
				};
				$scope.go = function (path) {
					$location.path(path);
				};
				$scope.resizeParent = faqService.resizeParent;
				$scope.getInnerText = function (html) {
					return $(String.format("<div>{0}</div>", html)).text().trim();
				};
			}
		};
	}]);
})(jQuery);