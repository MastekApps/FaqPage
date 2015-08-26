(function () {
	"use strict";

	angular.module("FaqApp.services").factory("faqService", ["context",
			function (context) {
				return {
					appPartConfigRepository: new AppPartsConfigRepository(FAQ.Lists.AppPartsConfigUrl),
					faqRepository: new FaqRepository(FAQ.Lists.FaqUrl),
					webService: FAQ.SPWebService,
					resizeParent: function (width, height) {
						if (window.parent !== window) {
							var $app = $jq("#ng-app-FaqApp");
							var message = "<Message senderId=" + context.senderId + " >"
								+ "resize(" + ($app.outerWidth() + 30) + "," + ($app.outerHeight() + 30) + ")</Message>";
							window.parent.postMessage(message, context.spHostUrl);
						}
					}
				};
			}
	]);
})();