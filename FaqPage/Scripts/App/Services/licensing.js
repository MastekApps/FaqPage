(function () {
	"use strict";

	angular.module("FaqApp.services").value("licenseStatus", {
		UnderTrial: 1,
		Licensed: 2,
		TrialExpired: 3,
		LicenseNotValid: 4
	});

	angular.module("FaqApp.services").factory("licensing", ["context", "faqService", "$q", "licenseStatus",
			function (context, faqService, $q, licenseStatus) {

				var licenseKey = "_faq_license_";
				var dateInstalledKey = "_faq_date_installed";
				var trialPeriodInDays = 30;
				var rsaKeyUrl = "Content/rsa_public_key.txt";
				var deferred = $q.defer();

				var checkTrialPeriod = function (dateInstalled) {
					var dateNow = moment();

					var dayDIff = dateNow.diff(dateInstalled, "days");

					if (dayDIff > trialPeriodInDays) {
						deferred.resolve({
							status: licenseStatus.TrialExpired
						});
					} else {
						deferred.resolve({
							status: licenseStatus.UnderTrial,
							daysLeft: trialPeriodInDays - dayDIff
						});
					}
				}

				return {
					getLicenseStatus: function () {
						var licenseDefererd = faqService.webService.webProperties.get(licenseKey);
						var hostWebIdDeferred = faqService.webService.getHostWebId();

						$q.all([licenseDefererd, hostWebIdDeferred]).then(function (results) {
							var license = results[0];
							var hostWebId = results[1];

							//if lecense provided
							if (license) {
								$jq.ajax({
									url: rsaKeyUrl,
									success: function (data) {
										var decrypt = new JSEncrypt();
										decrypt.setPublicKey(data);
										var uncryptedHostWebId = decrypt.decrypt(license);

										if (hostWebId === uncryptedHostWebId) {
											deferred.resolve({
												status: licenseStatus.Licensed,
												licenseKey: license
											});
										} else {
											deferred.resolve({
												status: licenseStatus.LicenseNotValid,
												licenseKey: license
											});
										}
									},
									dataType: "text"
								});
							}//check for trial period
							else {
								faqService.webService.webProperties.get(dateInstalledKey).then(function (date) {
									if (!date) {
										var currentDate = new Date();
										faqService.webService.webProperties.set(dateInstalledKey, currentDate).then(function () {
											checkTrialPeriod(moment(currentDate));
										});
									} else {
										checkTrialPeriod(moment(date));
									}

								}, function (error) {
									deferred.reject(error);
								});
							}

						}, function (error) {
							deferred.reject(error);
						});

						return deferred.promise;
					},
					setLicense: function (license) {
						return faqService.webService.webProperties.set(licenseKey, license);
					}
				};
			}
	]);
})();