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

	angular.module("FaqApp.services").factory("licensing", ["context", "$q", "licenseStatus", "storage", "$jq", "entitlementType",
	function (context, $q, licenseStatus, storage, $jq, entitlementType) {
		var tokenKey = "faq_token";
		var deferred = $q.defer();
		var tokenExpirationInMin = 60; // 1 hour
		var verificationServiceEndpoint = "https://verificationservice.officeapps.live.com/ova/verificationagent.svc/rest/verify?token=";

		function validateToken(xmlToken) {
			var token = $jq.xml2json(xmlToken).VerifyEntitlementTokenResponse;
			token.IsValid = (token.IsValid.toLowerCase() === "true");
			token.IsEntitlementExpired = (token.IsEntitlementExpired.toLowerCase() === "true");
			token.IsExpired = (token.IsExpired.toLowerCase() === "true");

			if (console) console.log(token);

			var entitlementTypeReceived = token.EntitlementType.toLowerCase();

			//TODO: Uncomment for release!
			//if (!token.IsValid || token.IsExpired) {
			//	deferred.resolve({
			//		status: licenseStatus.LicenseNotValid
			//	});

			//	return;
			//}

			switch (entitlementTypeReceived) {
				case entitlementType.Paid:
					{
						deferred.resolve({
							status: licenseStatus.Licensed,
							assetId: token.AssetId
						});
						break;
					}
				case entitlementType.Free:
					{
						deferred.resolve({
							status: licenseStatus.Licensed,
							assetId: token.AssetId
						});
						break;
					}
				case entitlementType.Trial:
					{
						if (token.IsEntitlementExpired) {
							deferred.resolve({
								status: licenseStatus.TrialExpired,
								assetId: token.AssetId
							});
							break;
						}

						var dateNow = moment();
						var dateExpiration = moment(token.EntitlementExpiryDate);

						deferred.resolve({
							status: licenseStatus.UnderTrial,
							daysLeft: dateExpiration.diff(dateNow, "days"),
							assetId: token.AssetId
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
				var licenseToken = storage.load(tokenKey);
				if (!licenseToken) {
					retriveToken().then(function (token) {
						if (!token) {
							deferred.resolve({
								status: licenseStatus.LicenseNotValid
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

				return deferred.promise;
			},
			setLicense: function (license) {

			}
		};
	}
	]);
})();