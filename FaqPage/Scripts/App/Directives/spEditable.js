(function () {
	"use strict";

	angular.module("FaqApp.directives").directive("spEditable", [
		function () {
			return {
				restrict: "A",
				scope: {},
				link: function ($scope, element) {
					element.addClass("ms-rte-layoutszone-inner-editable ms-rtestate-write").attr("role", "textbox").attr("aria-haspopup", "true").attr("contentEditable", "true").attr("aria-autocomplete", "both").attr("aria-autocomplete", "both").attr("aria-multiline", "true");
				}
			};
		}
	]);
})();