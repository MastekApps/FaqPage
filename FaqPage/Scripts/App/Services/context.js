(function () {
	"use strict";

	angular.module("FaqApp.services").factory("context", [
		function () {

			function getParameterByName(name) {
				name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
				var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
					results = regex.exec(location.search);
				return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
			}

			function getWebUrl(key) {
				var webUrl = getParameterByName(key);
				return webUrl.endsWith("/") ? webUrl : webUrl + "/";
			}

			var editModeValue = getParameterByName("editmode"), editMode = false;
			if (editModeValue) {
				editMode = !!(parseInt(editModeValue, 10));
			}

			return {
				editMode: editMode,
				spHostUrl: getWebUrl("SPHostUrl"),
				spAppWebUrl: getWebUrl("SPAppWebUrl"),
				wpId: getParameterByName("wpId"),
				senderId: getParameterByName("SenderId"),
				isDebug: window.faq_is_debug,
				productId: window.faq_product_id
			};
		}]);
})();