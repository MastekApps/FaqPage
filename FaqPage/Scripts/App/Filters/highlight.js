(function () {
	"use strict";
	angular.module("FaqApp.filters")
		.filter("faqhighlight", ["$sce", function ($sce) {
			return function(text, phrase) {
				if (phrase) {
					text = text.replace(new RegExp(phrase, "gi"), "<span class='highlighted'>$&</span>");
				}
				return $sce.trustAsHtml(text);
			}
		}]);
})();
