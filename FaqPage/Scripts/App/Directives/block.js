(function ($) {
	"use strict";

	angular.module("FaqApp.directives").
		directive("block", ["$log",
			function ($log) {
				$.blockUI.defaults.css = {};
				$.blockUI.defaults.overlayCSS.backgroundColor = "#FFF";
				$.blockUI.defaults.overlayCSS.cursor = "default";
				return {
					retstrict: "A",
					scope: {
						lock: "=block"
					},
					link: function ($scope, element) {
						$scope.$watch("lock", function () {
							if ($scope.lock && angular.isFunction($scope.lock.finally)) {
								$log.debug("Blocking...");

								element.addClass("locked").block({
									message: "<img src='Content/img/ajax-loader.gif'>"
								});

								$scope.lock.finally(function () {
									$log.debug("Unblocking...");
									element.removeClass("locked").unblock();
								});
							}
						});
					}
				};
			}
		]);
})(jQuery);