(function () {
	"use strict";
	angular.module("FaqApp.directives").directive("faqAnimate", [
		"$timeout", function ($timeout) {
			return {
				retstrict: "A",
				scope: {
					animatationName: "="
				},
				link: function ($scope, element) {
					$scope.$watch("animatationName", function (name, oldName) {
						if (name !== oldName && name) {
							var className;
							if (name === "cshow") {
								className = "ng-hide";
							} else {
								className = "animated " + name;
							}
							element.addClass(className);

							setTimeout(function () {
								element.removeClass(className);
							}, 1 * 1500);
						}
						$timeout(function () {
							$scope.animatationName = "";
						}, 100);
					});
				}
			};
		}
	]);
})();