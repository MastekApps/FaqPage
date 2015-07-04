(function () {
	"use strict";

	angular.module("FaqApp.services").value("licenseStatus", {
		UnderTrial: 1,
		Licensed: 2,
		TrialExpired: 3,
		LicenseNotValid: 4
	});

	angular.module("FaqApp.services").factory("licensing", ["context", "faqService", "$q", "licenseStatus", "storage", "$jq",
	function (context, faqService, $q, licenseStatus, storage, $jq) {
		var tokenKey = "faq_token";
		var deferred = $q.defer();
		var tokenExpirationInMin = 60 * 24;
		var verificationServiceEndpoint = "https://verificationservice.officeapps.live.com/ova/verificationagent.svc/rest/verify?token=";

		function validateToken(xmlToken) {
			var token = $jq.xml2json(xmlToken);
			console.log(token);

			deferred.resolve({
				status: licenseStatus.Licensed
			});
		}

		function retriveToken() {
			var ctx = SP.ClientContext.get_current();
			var licenseCollection = SP.Utilities.Utility.getAppLicenseInformation(ctx, context.productId);
			var tokenDeferred = $q.defer();

			ctx.executeQueryAsync(function () {
				var topLicense;
				var encodedTopLicense;
				if (licenseCollection.get_count() > 0) {
					topLicense = licenseCollection.get_item(0).get_rawXMLLicenseToken();
					encodedTopLicense = encodeURIComponent(topLicense);

					var request = new SP.WebRequestInfo();
					request.set_url(verificationServiceEndpoint + encodedTopLicense);
					request.set_method("GET");
					var response = SP.WebProxy.invoke(ctx, request);
					ctx.executeQueryAsync(function () {
						var xmlToken = response.get_body();

						tokenDeferred.resolve({ token: xmlToken });

					}, function (sender, error) {
						tokenDeferred.reject(new RequestError(error));
					});
				} else {
					tokenDeferred.resolve(null);
				}

			}, function (sender, error) {
				tokenDeferred.reject(new RequestError(error));
			});

			return tokenDeferred.promise;
		}

		return {
			getLicenseStatus: function () {
				SP.SOD.executeOrDelayUntilScriptLoaded(function () {
					var licenseToken = storage.load(tokenKey);
					if (!licenseToken) {
						retriveToken().then(function (data) {
							if (!data) {
								deferred.resolve({
									status: licenseStatus.LicenseNotValid
								});
							} else {
								storage.save(tokenKey, data.token, tokenExpirationInMin);

								validateToken(data.token);
							}
						}, function (error) {
							deferred.reject(error);
						});

					} else {
						validateToken(licenseToken);
					}
				}, "sp.js");

				return deferred.promise;
			},
			setLicense: function (license) {

			}
		};
	}
	]);
})();