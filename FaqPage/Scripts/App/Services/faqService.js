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
							var $app = $jq("#s4-workspace");
							var message = "<Message senderId=" + context.senderId + " >"
								+ "resize(" + $app.width() + "," + ($app.height() + 40) + ")</Message>";
							window.parent.postMessage(message, context.spHostUrl);
						}
					}
				};
			}
	]);
})();