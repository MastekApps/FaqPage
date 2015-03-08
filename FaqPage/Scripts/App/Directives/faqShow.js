(function () {
	"use strict";
	angular.module("FaqApp.directives").directive("faqShow", [
		"$animate", "faqService", "$log", function ($animate, faqService, $log) {
			return {
				retstrict: "A",
				scope: {
					faqShow: "=",
					animatationName: "="
				},
				link: function ($scope, element) {
					$scope.$watch("faqShow", function (show, oldShow) {
						if (show !== oldShow) {
							if (show) {
								element.removeClass("ng-hide");

								faqService.resizeParent();

								element.addClass("animated " + $scope.animatationName);
								$log.debug("addClass");
								setTimeout(function() {
									element.removeClass("animated " + $scope.animatationName);
								}, 1* 1000);
							} else {
								element.addClass("ng-hide");
								//element.removeClass("animated");
								//element.removeClass($scope.animatationName);
								faqService.resizeParent();
							}
						}
					});
				}
			};
		}
	]);
})();