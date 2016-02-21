(function () {
	"use strict";

	angular.module("FaqApp.services").value("licenseStatus", {
		UnderTrial: 1,
		Licensed: 2,
		TrialExpired: 3,
		LicenseNotValid: 4
	});

	angular.module("FaqApp.services").value("entitlementType", {
		Free: "free",
		Paid: "paid",
		Trial: "trial"
	});

	angular.module("FaqApp.services").factory("licensing", ["context", "faqService", "$q", "licenseStatus", "storage", "$jq", "entitlementType", "$log",
	function (context, faqService, $q, licenseStatus, storage, $jq, entitlementType, $log) {
		var tokenKey = "faq_token";
		var licenseKey = "_faq_license_";
		var deferred = $q.defer();
		var tokenExpirationInMin = 60; // 1 hour
		var verificationServiceEndpoint = "https://verificationservice.officeapps.live.com/ova/verificationagent.svc/rest/verify?token=";

		function validateToken(xmlToken) {
			var token = $jq.xml2json(xmlToken).VerifyEntitlementTokenResponse;
			token.IsValid = (token.IsValid.toLowerCase() === "true");
			token.IsEntitlementExpired = (token.IsEntitlementExpired.toLowerCase() === "true");
			token.IsExpired = (token.IsExpired.toLowerCase() === "true");

			$log.debug(token);

			var entitlementTypeReceived = token.EntitlementType.toLowerCase();

			//TODO: Uncomment for release!
			if (!token.IsValid || token.IsExpired) {
				deferred.resolve({
					status: licenseStatus.LicenseNotValid,
					assetId: context.assetId
				});

				return;
			}

			switch (entitlementTypeReceived) {
				case entitlementType.Paid:
					{
						deferred.resolve({
							status: licenseStatus.Licensed,
							assetId: context.assetId
						});
						break;
					}
				case entitlementType.Free:
					{
						deferred.resolve({
							status: licenseStatus.Licensed,
							assetId: context.assetId
						});
						break;
					}
				case entitlementType.Trial:
					{
						if (token.IsEntitlementExpired) {
							deferred.resolve({
								status: licenseStatus.TrialExpired,
								assetId: context.assetId
							});
							break;
						}

						var dateNow = moment();
						var dateExpiration = moment(token.EntitlementExpiryDate);

						deferred.resolve({
							status: licenseStatus.UnderTrial,
							daysLeft: dateExpiration.diff(dateNow, "days"),
							assetId: context.assetId
						});
					}
			}
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

						tokenDeferred.resolve(xmlToken);

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
				//fix for previous installations
				faqService.webService.webProperties.get(licenseKey)
					.then(function (license) {
						if (license) {  //previous install, skip license verification
							deferred.resolve({
								status: licenseStatus.Licensed,
								assetId: context.assetId
							});
						} else {//normal paid install
							var licenseToken = storage.load(tokenKey);
							if (!licenseToken) {
								retriveToken().then(function (token) {
									if (!token) {
										deferred.resolve({
										    status: licenseStatus.LicenseNotValid,
										    assetId: context.assetId
                                    });
									} else {
										storage.save(tokenKey, token, tokenExpirationInMin);

										validateToken(token);
									}
								}, function (error) {
									deferred.reject(error);
								});

							} else {
								validateToken(licenseToken);
							}
						}
					}, function(error) {
						deferred.reject(error);
					});
				return deferred.promise;
			}
		};
	}]);
})();