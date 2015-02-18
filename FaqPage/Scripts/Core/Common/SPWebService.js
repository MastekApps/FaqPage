FAQ.SPWebService =
(function () {
	"use strict";

	function getQueryStringParameter(paramToRetrieve) {
		var params =
			document.URL.split("?")[1].split("&");
		var strParams = "";
		for (var i = 0; i < params.length; i = i + 1) {
			var singleParam = params[i].split("=");
			if (singleParam[0] == paramToRetrieve)
				return singleParam[1];
		}
	};

	return {
		getHostWebId: function() {
			var deferred = angular.injector(['ng']).get("$q").defer();

			var hostweburl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
			var currentContext = SP.ClientContext.get_current();
			var hostContext = new SP.AppContextSite(currentContext, hostweburl);
			var hostWeb = hostContext.get_web();
			currentContext.load(hostWeb);
			currentContext.executeQueryAsync(function () {
				deferred.resolve(hostWeb.get_id().toString());
			}, function (sender, error) {
				deferred.reject(new RequestError(error));
			});

			return deferred.promise;
		},

		webProperties: {
			get: function (key) {

				var deferred = angular.injector(['ng']).get("$q").defer();

				var ctx = new SP.ClientContext.get_current();
				var webProperties = ctx.get_web().get_allProperties();
				ctx.load(webProperties);

				ctx.executeQueryAsync(function () {
					deferred.resolve(webProperties.get_fieldValues()[key]);
				}, function (sender, error) {
					deferred.reject(new RequestError(error));
				});

				return deferred.promise;
			},
			set: function (key, value) {
				var deferred = angular.injector(['ng']).get("$q").defer();

				var ctx = new SP.ClientContext.get_current();
				var web = ctx.get_web();
				var webProperties = web.get_allProperties();
				ctx.load(webProperties);

				ctx.executeQueryAsync(function () {
					webProperties.set_item(key, value);
					web.update();
					ctx.executeQueryAsync(function () {
						deferred.resolve();
					}, function (sender, error) {
						deferred.reject(new RequestError(error));
					});
				}, function (sender, error) {
					deferred.reject(new RequestError(error));
				});

				return deferred.promise;
			}
		}
	};
})();