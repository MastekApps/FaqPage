///#source 1 1 /Scripts/App/app.js
(function () {
	"use strict";

	angular.module("FaqApp.controllers", []);
	angular.module("FaqApp.services", []);
	angular.module("FaqApp.directives", []);
	angular.module("FaqApp.filters", []);

	angular.module("ViewFaqApp", [
		"FaqApp.controllers",
		"FaqApp.services",
		"FaqApp.directives",
		"FaqApp.filters",
		"ngRoute",
		"ngSanitize",
		"ngAnimate",
		"ui.bootstrap",
		"ui.sortable"
	]).
	config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
			when("/", { templateUrl: "partials/FaqList.html", controller: "FaqViewCtrl" }).
			otherwise({ redirectTo: "/" });
	}]).config(["$logProvider", function ($logProvider) {
		$logProvider.debugEnabled(window.faq_is_debug);
	}]);;

	angular.module("EditFaqApp", [
		"FaqApp.controllers",
		"FaqApp.services",
		"FaqApp.directives",
		"ngRoute",
		"ngSanitize",
		"ngAnimate",
		"ui.bootstrap",
		"ui.sortable",
		"ngToast"
	]).
	config(["$routeProvider", function ($routeProvider) {
		$routeProvider.
			when("/", { templateUrl: "partials/EditMode/FaqEditStartScreen.html", controller: "FaqEditCtrl" }).
			when("/SelectForEdit", { templateUrl: "partials/EditMode/SelectFaqSetForEdit.html", controller: "SelectFaqForEditCtrl" }).
			when("/ConnectFaqSet", { templateUrl: "partials/EditMode/ConnectFaqSet.html", controller: "ConnectFaqSetCtrl" }).
			when("/NewFaqSet", { templateUrl: "partials/EditMode/NewFaqSet.html", controller: "FaqEditCtrl" }).
			when("/ManageFaqSet/:folderUrl", { templateUrl: "partials/EditMode/ManageFaqSet.html", controller: "ManageFaqSetCtrl" }).
			when("/ManageFaqSet/:folderUrl/faq/edit/:faqId", { templateUrl: "partials/EditMode/CreateEditFaq.html", controller: "CreateEditFaqCtrl" }).
			when("/ManageFaqSet/:folderUrl/faq/new", { templateUrl: "partials/EditMode/CreateEditFaq.html", controller: "CreateEditFaqCtrl" }).
			when("/Licensing", { templateUrl: "partials/EditMode/LicenseRequest.html", controller: "RegisterAppCtrl" }).
			when("/ContactDev", { templateUrl: "partials/EditMode/ContactDeveloper.html", controller: "ContactDeveloperCtrl" }).
			otherwise({ redirectTo: "/" });
	}]).config(["$logProvider", function ($logProvider) {
		$logProvider.debugEnabled(window.faq_is_debug);
	}]);
})();
///#source 1 1 /Scripts/App/Services/processing.js
(function($) {
    "use strict";

    angular.module("FaqApp.services").
	factory("processing", ["$sce", "$location", "faqService",
	function ($sce, $location, faqService) {
		return {
			initilize: function ($scope) {
				$scope.Resources = FAQRS;
				$scope.trustedHtml = function (input) {
					return $sce.trustAsHtml(input);
				};
				$scope.go = function (path) {
					$location.path(path);
				};
				$scope.resizeParent = faqService.resizeParent;
				$scope.getInnerText = function (html) {
					return $(String.format("<div>{0}</div>", html)).text().trim();
				};
			}
		};
	}]);
})(jQuery);
///#source 1 1 /Scripts/App/Services/faqSetModel.js
(function() {
    "use strict";

    angular.module("FaqApp.services").factory("faqSetModel", [
            function() {
                return {
                    faqSetName: ""
                };
            }
        ]);
})();
///#source 1 1 /Scripts/App/Services/faqService.js
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
///#source 1 1 /Scripts/App/Services/context.js
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
				senderId: getParameterByName("SenderId")
			};
		}]);
})();
///#source 1 1 /Scripts/App/Services/jq.js
(function () {
    "use strict";

    angular.module("FaqApp.services").factory("$jq", function() {
        return window.jQuery;
    });
})();
///#source 1 1 /Scripts/App/Services/animationList.js
(function () {
	"use strict";

	var animations = {};
	animations["cshow"] = FAQRS.SimpleAnimation;

	animations["fadeIn"] = FAQRS.FadeIn;
	animations["fadeInUp"] = FAQRS.FadeInUp;
	animations["fadeInRight"] = FAQRS.FadeInRight;
	animations["fadeInLeft"] = FAQRS.FadeInLeft;
	animations["fadeInDown"] = FAQRS.FadeInDown;

	animations["bounceIn"] = FAQRS.BounceIn;
	animations["bounceInLeft"] = FAQRS.BounceInLeft;
	animations["bounceInRight"] = FAQRS.BounceInRight;
	animations["bounceInUp"] = FAQRS.BounceInUp;
	animations["bounceInDown"] = FAQRS.BounceInDown;

	animations["flip"] = FAQRS.Flip;
	animations["flipInX"] = FAQRS.FlipInX;
	animations["flipInY"] = FAQRS.FlipInY;

	animations["rotateIn"] = FAQRS.RotateIn;
	animations["rotateInDownLeft"] = FAQRS.RotateInDownLeft;
	animations["rotateInDownRight"] = FAQRS.RotateInDownRight;
	animations["rotateInUpLeft"] = FAQRS.RotateInUpLeft;
	animations["rotateInUpRight"] = FAQRS.RotateInUpRight;

	animations["zoomIn"] = FAQRS.ZoomIn;
	animations["zoomInUp"] = FAQRS.ZoomInUp;
	animations["zoomInRight"] = FAQRS.ZoomInRight;
	animations["zoomInLeft"] = FAQRS.ZoomInLeft;
	animations["zoomInDown"] = FAQRS.ZoomInDown;

	animations["pulse"] = FAQRS.Pulse;
	animations["swing"] = FAQRS.Swing;
	animations["tada"] = FAQRS.Tada;
	animations["lightSpeedIn"] = FAQRS.LightSpeedIn;
	animations["rollIn"] = FAQRS.RollIn;
	animations["wobble"] = FAQRS.Wobble;

	angular.module("FaqApp.services").value("animationList", animations);
})();
///#source 1 1 /Scripts/App/Services/licensing.js
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
///#source 1 1 /Scripts/App/Directives/spEditable.js
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
///#source 1 1 /Scripts/App/Directives/ngEnter.js
(function() {
    "use strict";
    
    angular.module("FaqApp.directives").directive('ngEnter', function () {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if (event.which === 13) {
	                scope.$apply(function () {
	                    scope.$eval(attrs.ngEnter);
	                });

	                event.preventDefault();
	            }
	        });
	    };
	});
})();
///#source 1 1 /Scripts/App/Directives/faqShow.js
(function () {
	"use strict";
	angular.module("FaqApp.directives").directive("faqShow", [
		"$animate", "faqService", "$log", function ($animate, faqService, $log) {
			return {
				retstrict: "A",
				scope: {
					faqShow: "=",
					animatationName: "="
				},
				link: function ($scope, element) {
					$scope.$watch("faqShow", function (show, oldShow) {
						$log.debug(show + "_" + oldShow);
						if (show !== oldShow) {
							if (show) {
								element.removeClass("ng-hide");

								faqService.resizeParent();

								element.addClass("animated " + $scope.animatationName);
								$log.debug("addClass");
								setTimeout(function() {
									element.removeClass("animated " + $scope.animatationName);
								}, 1* 1000);
							} else {
								element.addClass("ng-hide");
								$log.debug("hide");
								//element.removeClass("animated");
								//element.removeClass($scope.animatationName);
								faqService.resizeParent();
							}
						}
					});
				}
			};
		}
	]);
})();
///#source 1 1 /Scripts/App/Directives/contenteditable.js
(function() {
    "use strict";

    angular.module("FaqApp.directives").directive("contenteditable", [
            function() {
                return {
                    require: "ngModel",
                    link: function($scope, element, attrs, ngModel) {
                        // view -> model
                        element.on("blur", function() {
                            $scope.$apply(function() {
                                ngModel.$setViewValue(element.html());
                            });
                        });

                        // model -> view
                        ngModel.$render = function() {
                            element.html(ngModel.$viewValue);
                        };

                        ngModel.$render();
                    }
                };
            }
        ]);
})();
///#source 1 1 /Scripts/App/Directives/block.js
(function ($) {
	"use strict";

	angular.module("FaqApp.directives").
		directive("block", ["$log",
			function ($log) {
				$.blockUI.defaults.css = {};
				$.blockUI.defaults.overlayCSS.backgroundColor = "#FFF";
				$.blockUI.defaults.overlayCSS.cursor = "default";
				return {
					retstrict: "A",
					scope: {
						lock: "=block"
					},
					link: function ($scope, element) {
						$scope.$watch("lock", function () {
							if ($scope.lock && angular.isFunction($scope.lock.finally)) {
								$log.debug("Blocking...");

								element.addClass("locked").block({
									message: "<img src='Content/img/ajax-loader.gif'>"
								});

								$scope.lock.finally(function () {
									$log.debug("Unblocking...");
									element.removeClass("locked").unblock();
								});
							}
						});
					}
				};
			}
		]);
})(jQuery);
///#source 1 1 /Scripts/App/Directives/faqAnimate.js
(function () {
	"use strict";
	angular.module("FaqApp.directives").directive("faqAnimate", [
		"$timeout", function ($timeout) {
			return {
				retstrict: "A",
				scope: {
					animatationName: "="
				},
				link: function ($scope, element) {
					$scope.$watch("animatationName", function (name, oldName) {
						if (name !== oldName && name) {
							var className;
							if (name === "cshow") {
								className = "ng-hide";
							} else {
								className = "animated " + name;
							}
							element.addClass(className);

							setTimeout(function () {
								element.removeClass(className);
							}, 1 * 1500);
						}
						$timeout(function () {
							$scope.animatationName = "";
						}, 100);
					});
				}
			};
		}
	]);
})();
///#source 1 1 /Scripts/App/Controllers/SelectFaqForEditCtrl.js
(function() {
    "use strict";
    angular.module("FaqApp.controllers").controller("SelectFaqForEditCtrl", [
            "processing", "$scope", "faqService", "$modal", "$jq",
            function (processing, $scope, faqService, $modal, $jq) {
                processing.initilize($scope);

                $scope.viewDeferred = faqService.faqRepository.getRootFolders();
                $scope.viewDeferred.then(function (folders) {
                    $scope.folders = folders;
                    faqService.faqRepository.folder = null;

                    $scope.$apply();
                }, function(error) {
                    alert(error.message);
                });

                $scope.editFaqSet = function(folder) {
                    $scope.go(String.format("/ManageFaqSet/{0}", folder.title));
                };

                $scope.deleteFaqSet = function(folder) {
                    var modalInstance = $modal.open({
                        templateUrl: "deleteFaqModal.html",
                        controller: "ModalInstanceCtrl",
                        size: "sm"
                    });

                    modalInstance.result.then(function() {
                        $scope.viewDeferred = faqService.faqRepository.deleteItem(folder);
                        $scope.viewDeferred.then(function () {
                            var indexToRemove = -1;
                            Array.forEach($scope.folders, function(currentFolder, index) {
                                if (currentFolder.id === folder.id) {
                                    indexToRemove = index;
                                    return;
                                }
                            });
                            if (indexToRemove > -1) {
                                $scope.folders.splice(indexToRemove, 1);
                            }

                            $scope.$apply();
                        }, function(error) {
                            alert(error.message);
                        });
                    }, function() {});
                };

                $scope.revertFolderName = function($repeatScope, folder) {
                    folder.title = folder.initialName;
                    $repeatScope.changed = $repeatScope.submitted = false;
                };

                $scope.initScope = function($repeatScope, folder) {
                    folder.initialName = folder.title;
                    $repeatScope.$watch("folder.title", function() {
                        $repeatScope.folder.fileLeafRef = $repeatScope.folder.title;
                    });
                };

                $scope.changeFolderName = function($repeatScope, folder) {
                    $repeatScope.submitted = true;

                    if ($repeatScope.faqSetForm.$invalid) return;

                    var hasDuplicateName = $jq.grep($repeatScope.folders, function (currentFolder) {
                        if (currentFolder.id === folder.id && currentFolder != folder) return true;

                        return false;
                    }).length > 0;

                    if (hasDuplicateName) {
                        $repeatScope.folderExists = true;
                        return;
                    }

                    $scope.viewDeferred = faqService.faqRepository.saveItem(folder);
                    $scope.viewDeferred.then(function () {
                        folder.initialName = folder.title;
                        $repeatScope.changed = $repeatScope.submitted = false;

                        $scope.$apply();
                    }, function(error) {
                        $repeatScope.folderExists = (error.errorCode === FAQ.ErrorCodes.FolderAlreadyExists);
                        $repeatScope.illegalCharacter = (error.errorCode === FAQ.ErrorCodes.IllegalName);
                        if (!$repeatScope.folderExists && !$repeatScope.illegalCharacter) {
                            $repeatScope.commonError = true;
                            $repeatScope.errorMessage = error.message;
                        }

                        $scope.$apply();
                    });
                };
            }
        ]);
})();
///#source 1 1 /Scripts/App/Controllers/ModalInstanceCtrl.js
(function() {
    "use strict";

    angular.module("FaqApp.controllers").
        controller("ModalInstanceCtrl", [
            "$modalInstance", "$scope", "processing", "$location",
            function($modalInstance, $scope, processing) {
                processing.initilize($scope);

                $scope.ok = function() {
                    $modalInstance.close();
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss("cancel");
                };
            }
        ]);
})();
///#source 1 1 /Scripts/App/Controllers/FaqViewCtrl.js
(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("FaqViewCtrl", [
		"$scope", "$sce", "$q", "$timeout", "faqService", "processing", "context", "$log", "$window",
		function ($scope, $sce, $q, $timeout, faqService, processing, context, $log, $window) {
			processing.initilize($scope);
			var folder, resizeAttempts = 2, resizeTimeOut = 200;

			$scope.faqItems = null;
			$scope.appPartInitialized = true;

			if (context.editMode) {
				var editPageUrl = String.format("{0}FaqAppPartEditMode.aspx{1}/#/ConnectFaqSet", context.spAppWebUrl, $window.location.search);
				$log.debug(editPageUrl);
				$window.location.href = editPageUrl;
				return;
			}

			var wpId = context.wpId;

			var deferred = $q.defer();
			$scope.viewDeferred = deferred.promise;

			$scope.changeVisibility = function (faqItem, repeatScope) {
				if ($scope.forceExpand) {
					return;
				}
				repeatScope.playingAnimation = folder.faqSetSettings.animation;
				faqItem.isShown = !faqItem.isShown;
				faqItem.expanded = !faqItem.expanded;
			}

			$scope.clearSearch = function() {
				if (!$scope.searchText) {
					return;
				}
				$scope.searchText = "";
				$timeout(function () {
					faqService.resizeParent();
				}, 100);
			}

			$scope.filterByQuestionAnswer = function (faq) {
				if (!$scope.searchText) {
					return true;
				}
				var toSearch = $scope.searchText.toLowerCase();
				return faq.question.toLowerCase().indexOf(toSearch) !== -1 || faq.answer.toLowerCase().indexOf(toSearch) !== -1;
			}

			$scope.resize = function () {
				$timeout(function () {
					faqService.resizeParent();
				}, 100);
			}

			faqService.appPartConfigRepository.getByAppPartId(wpId).then(function (config) {
				if (!config) {
					$scope.appPartInitialized = false;
					deferred.resolve();
					$scope.$apply();
				} else {
					faqService.faqRepository.getItemById(config.configData.folderId).then(function (loadedFolder) {
						folder = loadedFolder;
						faqService.faqRepository.folder = folder.title;
						$scope.playingAnimation = folder.faqSetSettings.animation;
						$scope.showPlusSymbol = folder.faqSetSettings.showPlusSymbol;
						$scope.forceExpand = folder.faqSetSettings.useAnimation === false;
						$scope.showSearch = folder.faqSetSettings.searchEnabled;
						
						faqService.faqRepository.getItems().then(function (items) {
							Array.forEach(items, function (item) {
								item.isShown = item.expanded;
							});
							$scope.faqItems = items;
							deferred.resolve();

							$scope.$apply();

							faqService.resizeParent();
							$log.debug("faqService.resizeParent()");

							var resizeInterval = setInterval(function () {
								resizeAttempts--;
								if (resizeAttempts === 0) {
									clearInterval(resizeInterval);
								}
								faqService.resizeParent();
								$log.debug("faqService.resizeParent() - interval");
							}, 1 * resizeTimeOut);
						}, function (error) {
							deferred.resolve();
							alert(error.message);
						});
					}, function (error) {
						deferred.resolve();
						alert(error.message);
					});
				}
			}, function (error) {
				deferred.resolve();
				alert(error.message);
			});
		}
	]);
})();
///#source 1 1 /Scripts/App/Controllers/ManageFaqSetCtrl.js
(function () {
	"use strict";

	angular.module("FaqApp.controllers").
		controller("ManageFaqSetCtrl", [
			"$scope", "$sce", "faqService", "$location", "faqSetModel", "processing", "$modal", "$routeParams",
			function ($scope, $sce, faqService, $location, faqSetModel, processing, $modal, $routeParams) {
				processing.initilize($scope);
				
				faqSetModel.faqSetName = $routeParams.folderUrl;
				$scope.faqSetModel = faqSetModel;
				$scope.activeTab = "tab1";
				faqService.faqRepository.folder = $routeParams.folderUrl;

				$scope.viewDeferred = faqService.faqRepository.getOrderedItems();
				$scope.viewDeferred.then(function (items) {
					Array.forEach(items, function (item) {
						item.isShown = item.expanded;
					});
					$scope.faqItems = items;
					$scope.$apply();
				}, function (error) {
					alert(error.message);
				});

				$scope.newFaq = function () {
					$scope.go(String.format("/ManageFaqSet/{0}/faq/new", $routeParams.folderUrl));
				};

				$scope.editFaq = function (faqItem) {
					$scope.go(String.format("/ManageFaqSet/{0}/faq/edit/{1}", $routeParams.folderUrl, faqItem.id));
				};

				$scope.deleteFaq = function (faqItem) {
					var modalInstance = $modal.open({
						templateUrl: "deleteFaqModal.html",
						controller: "ModalInstanceCtrl",
						size: "sm"
					});
					modalInstance.result.then(function () {
						$scope.viewDeferred = faqService.faqRepository.deleteItem(faqItem);
						$scope.viewDeferred.then(function () {
							var indexToRemove = -1;
							Array.forEach($scope.faqItems, function (item, index) {
								if (item.id === faqItem.id) {
									indexToRemove = index;
									return;
								}
							});
							if (indexToRemove > -1) {
								$scope.faqItems.splice(indexToRemove, 1);
							}

							$scope.$apply();
						}, function (error) {
							alert(error.message);
						});
					}, function () { });
				};

				$scope.sortableOptions = {
					placeholder: "sortable-placeholder",
					stop: function () {
						Array.forEach($scope.faqItems, function (item, index) {
							item.order = index;
						});

						$scope.viewDeferred = faqService.faqRepository.updateOrdering($scope.faqItems);
						$scope.viewDeferred.then(function () {

						}, function (error) {
							alert(error.message);
						});
					}
				};
			}
		]);
})();
///#source 1 1 /Scripts/App/Controllers/CreateEditFaqCtrl.js
(function () {
	"use strict";

	angular.module("FaqApp.controllers").
		controller("CreateEditFaqCtrl", [
			"$scope", "$sce", "$routeParams", "$q", "faqService", "processing","ngToast",
			function ($scope, $sce, $routeParams, $q, faqService, processing, ngToast) {
				processing.initilize($scope);

				var faqItem;
				faqService.faqRepository.folder = $routeParams.folderUrl;

				//edit mode
				if ($routeParams.faqId) {
					//if item is not requested yet
					faqService.faqRepository.getItemById(parseInt($routeParams.faqId, 10)).then(function (item) {
						faqItem = item;
						initModel();
						$scope.$apply();
					}, function (error) {
						alert(error.message);
					});
				} else { // new mode
					faqItem = new FaqListItem();
					faqItem.expanded = true;
					initModel();
				}

				function initModel() {
					$scope.faqItem = faqItem;

					$scope.$watch("faqItem.question", function () {
						$scope.question = $scope.getInnerText(faqItem.question);
					});
					$scope.$watch("faqItem.answer", function () {
						$scope.answer = $scope.getInnerText(faqItem.answer);
					});

					$scope.saveFaq = function () {
						$scope.submitted = true;
						if ($scope.faqForm.$invalid) return;

						var deferred = $q.defer();
						$scope.viewDeferred = deferred.promise;
						faqService.faqRepository.getLastItem().then(function (item) {
							if (!faqItem.order) {
								faqItem.order = item ? item.id + 1 : 1;
							}
							faqService.faqRepository.saveItem(faqItem).then(function () {
								ngToast.create({
									content: $scope.Resources.QuestionSaved
								});
								deferred.resolve();
								$scope.go(String.format("/ManageFaqSet/{0}", $routeParams.folderUrl));
							}, function (error) {
								deferred.resolve();
								alert(error.message);
							});
						}, function (error) {
							deferred.resolve();
							alert(error.message);
						});
					};

					$scope.back = function () {
						$scope.go(String.format("/ManageFaqSet/{0}", $routeParams.folderUrl));
					};
				}
			}
		]);
})();
///#source 1 1 /Scripts/App/Controllers/FaqEditCtrl.js
(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("FaqEditCtrl", [
		"$scope", "$sce", "faqService", "$location", "faqSetModel", "processing", "context",
		function ($scope, $sce, faqService, $location, faqSetModel, processing, context) {
			processing.initilize($scope);

			faqSetModel.faqSetName = "";
			$scope.faqSetModel = faqSetModel;
			$scope.wpIdProvided = !!context.wpId;

			$scope.newFaqSet = function () {
				$scope.submitted = true;
				if ($scope.faqForm.$invalid) return;

				$scope.createFolderDeferred = faqService.faqRepository.createFaqFolder(faqSetModel.faqSetName, {
					useAnimation: false,
					showPlusSymbol: true,
					animation: "cshow",
					searchEnabled: false
				});

				$scope.createFolderDeferred.then(function () {
					$scope.go(String.format("/ManageFaqSet/{0}", faqSetModel.faqSetName));
					$scope.$apply();
				}, function (error) {
					$scope.folderExists = (error.errorCode === FAQ.ErrorCodes.FolderAlreadyExists);
					$scope.illegalCharacter = (error.errorCode === FAQ.ErrorCodes.IllegalName);
					if (!$scope.folderExists && !$scope.illegalCharacter) {
						$scope.commonError = true;
						$scope.errorMessage = error.message;
					}

					$scope.$apply();
				});
			};
		}
	]);
})();
///#source 1 1 /Scripts/App/Controllers/ConnectFaqSetCtrl.js
(function () {
	"use strict";
	angular.module("FaqApp.controllers").controller("ConnectFaqSetCtrl", [
		"processing", "$scope", "$q", "$jq", "faqService", "context","ngToast",
		function (processing, $scope, $q, $jq, faqService, context, ngToast) {
			processing.initilize($scope);

			var wpId = context.wpId;

			$scope.viewDeferred = $q.all([faqService.faqRepository.getRootFolders(), faqService.appPartConfigRepository.getByAppPartId(wpId)]);

			$scope.viewDeferred.then(function (results) {
				$scope.folders = results[0];

				var config = results[1];
				if (config) {
					var folder = $jq.grep($scope.folders, function (currentFolder) {
						if (currentFolder.id === config.configData.folderId) return true;

						return false;
					})[0];

					folder.title = folder.title + " " + $scope.Resources.CurrentlySelected;
					$scope.folder = folder;
				} else {
					if ($scope.folders && $scope.folders.length) {
						$scope.folder = $scope.folders[0];
					}
				}
			}, function (error) {
				alert(error.message);
			});

			$scope.connectAppPart = function (folder) {
				faqService.appPartConfigRepository.getByAppPartId(wpId).then(function (config) {
					if (!config) {
						config = new AppPartConfigListItem();
						config.wpId = wpId;
						config.configData = {};
					}

					config.configData.folderId = folder.id;
					faqService.appPartConfigRepository.saveItem(config).then(function () {
						ngToast.create({
							content: $scope.Resources.DataSaved
						});

						$scope.$apply();
					}, function (error) {
						alert(error.message);
					});
				}, function (error) {
					alert(error.message);
				});
			};
		}
	]);
})();
///#source 1 1 /Scripts/App/Controllers/CommonFaqSetSettingsCtrl.js
(function () {
	"use strict";

	angular.module("FaqApp.controllers").
		controller("CommonFaqSetSettingsCtrl", [
			"$scope", "faqService", "processing", "$routeParams", "$timeout", "$jq", "animationList", "ngToast",
			function ($scope, faqService, processing, $routeParams, $timeout, $jq, animationList, ngToast) {
				processing.initilize($scope);
				var folder;

				$scope.viewDeferred = faqService.faqRepository.getRootFolders();

				$scope.viewDeferred.then(function(folders) {
					folder = $jq.grep(folders, function (currentFolder) {
						if (currentFolder.title === $routeParams.folderUrl) return true;

						return false;
					})[0];

					$scope.faqSettings = folder.faqSetSettings;
					$scope.setSelectedAnimation($scope.faqSettings.animation);
				});

				$scope.setSelectedAnimation = function (name) {
					$scope.selectedAnimation = animationList[name];
					$scope.playingAnimation = name;
					$scope.faqSettings.animation = name;
				}

				$scope.testAnimation = function () {
					$scope.playingAnimation = $scope.faqSettings.animation;
				};

				$scope.saveSettings = function () {
					folder.faqSetSettings = $scope.faqSettings;
					$scope.viewDeferred = faqService.faqRepository.saveItem(folder);
					ngToast.create({
						content: $scope.Resources.DataSaved
					});
				};
			}
		]);
})();
///#source 1 1 /Scripts/App/Controllers/LicensingCtrl.js
(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("LicensingCtrl", [
		"$scope", "faqService", "$location", "$q", "processing", "licenseStatus", "licensing",
		function ($scope, faqService, $location, $q, processing, licenseStatus, licensing) {
			processing.initilize($scope);

			$scope.lockDeferred = licensing.getLicenseStatus();

			$scope.showIfLicenseValid = function() {
				return $scope.licensed || $scope.underTrial || $location.path() === "/Licensing";
			};

			$scope.isAppPart = window.parent !== window;

			$scope.lockDeferred.then(function (license) {
				$scope.underTrial = license.status === licenseStatus.UnderTrial;
				$scope.licensed = license.status === licenseStatus.Licensed;
				$scope.trialExpired = license.status === licenseStatus.TrialExpired;
				$scope.licenseNotValid = license.status === licenseStatus.LicenseNotValid;
				$scope.daysLeft = license.daysLeft;
			}, function(error) {
				alert(error);
			});
		}
	]);
})();
///#source 1 1 /Scripts/App/Controllers/RegisterAppCtrl.js
(function () {
	"use strict";

	angular.module("FaqApp.controllers").
		controller("RegisterAppCtrl", [
			"$scope", "faqService", "processing", "$q", "$window", "ngToast", "licenseStatus", "licensing",
			function ($scope, faqService, processing, $q, $window, ngToast, licenseStatus, licensing) {
				processing.initilize($scope);

				$scope.lockDeferred = $q.defer();

				licensing.getLicenseStatus().then(function (license) {
					$scope.underTrial = license.status === licenseStatus.UnderTrial;
					$scope.licensed = license.status === licenseStatus.Licensed;
					$scope.trialExpired = license.status === licenseStatus.TrialExpired;
					$scope.licenseNotValid = license.status === licenseStatus.LicenseNotValid;
					$scope.licenseKey = license.licenseKey;

					faqService.webService.getHostWebId().then(function (webId) {
						$scope.hostWebId = webId;
						$scope.lockDeferred.resolve();
						$scope.$apply();
					}, function (error) {
						$scope.lockDeferred.reject();
						alert(error);
					});
				}, function (error) {
					$scope.lockDeferred.reject();
					alert(error);
				});

				$scope.applyLicense = function () {
					licensing.setLicense($scope.licenseKey).then(function () {
						ngToast.create({
							content: $scope.Resources.LicenseApplied
						});
						$scope.$apply();
						setTimeout(function() {
							$window.location.reload();
						}, 1 * 1000);
					}, function(error) {
						alert(error);
					});
				}
			}
		]);
})();
///#source 1 1 /Scripts/App/Controllers/ContactDeveloperCtrl.js
(function () {
	"use strict";

	angular.module("FaqApp.controllers").controller("ContactDeveloperCtrl", [
		"$scope", "processing",
		function ($scope, processing) {
			processing.initilize($scope);
		}
	]);
})();
///#source 1 1 /Scripts/App/Filters/highlight.js
(function () {
	"use strict";
	angular.module("FaqApp.filters")
		.filter("highlight", ["$sce", function ($sce) {
			return function(text, phrase) {
				if (phrase) {
					text = text.replace(new RegExp(phrase, "gi"), "<span class='highlighted'>$&</span>");
				}
				return $sce.trustAsHtml(text);
			}
		}]);
})();

