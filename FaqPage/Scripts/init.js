(function ($) {
	"use strict";

	window.$jq = jQuery.noConflict();

	//FIX - script error in FireFox when using angular and Rich Text Editor
	if (browseris.firefox || browseris.chrome) {
		ExecuteOrDelayUntilScriptLoaded(function () {

			var oldAddStyleSheetRule = RTE.RteUtility.addStyleSheetRule;
			RTE.RteUtility.addStyleSheetRule = function (styleSheet, selector, style, index) {
				try {
					oldAddStyleSheetRule(styleSheet, selector, style, index);
				} catch (e) {
					oldAddStyleSheetRule(styleSheet, selector, style, 1);
				}
			};
		}, "sp.ui.rte.js");
	}

	if (!_spBodyOnLoadCalled) {
		_spBodyOnLoadFunctions.push(load);
	} else {
		load();
	}

	function AsyncScript(key, src, onLoadFunction) {
		var e = Function.validateParameters(arguments, [
			{ name: "key", type: String },
			{ name: "src", type: String }
		], false);

		if (e) throw e;

		this.key = key;
		this.src = src;
		var self = this;
		this.onLoadFunction = function() {
			if (typeof NotifyScriptLoadedAndExecuteWaitingJobs === "function") {
				NotifyScriptLoadedAndExecuteWaitingJobs(self.key);
			}

			if (onLoadFunction && typeof onLoadFunction === "function") {
				onLoadFunction();
			}
		};

		RegisterSod(this.key, this.src);
	}

	AsyncScript.prototype = {
		constructor: AsyncScript,
		registerDependency: function (asyncScripts) {
			var e = Function.validateParameters(arguments, [
				{ name: "asyncScripts", type: Array, elementType: AsyncScript }
			]);

			if (e) throw e;

			Array.forEach(asyncScripts, function (asyncScript) {
				RegisterSodDep(this.key, asyncScript.key);
			}, this);
		},
		registerDependencyByName: function (kies) {
			var e = Function.validateParameters(arguments, [
				{ name: "kies", type: Array, elementType: String }
			]);

			if (e) throw e;

			Array.forEach(kies, function (key) {
				RegisterSodDep(this.key, key);
			}, this);
		},
		load: function () {
			LoadSodByKey(this.key, this.onLoadFunction);
		}
	};

	var registeredResources = ["en-us", "ru-ru"];

	function load() {
		var hash = window.faq_version;
		var webRelUrl = _spPageContextInfo.webServerRelativeUrl;

		if (!webRelUrl.endsWith("/")) {
			webRelUrl = webRelUrl + "/";
		}

		var currentUICulture = GetUrlKeyValue("SPLanguage");
		if (!currentUICulture || $.inArray(currentUICulture.toLowerCase(), registeredResources) === -1) {
			currentUICulture = "en-us";
		}

		var coreScriptSrc = String.format("{0}Scripts/build/faq.app.core.min.js?v={1}", webRelUrl, hash);
		var resourcesScriptSrc = String.format("{0}Scripts/Resources/Resources.{1}.js?v={2}", webRelUrl, currentUICulture.toLowerCase(), hash);
		var angularAppSrc = String.format("{0}Scripts/build/faq.app.min.js?v={1}", webRelUrl, hash);

		var resourcesScript = new AsyncScript("faq.resources", resourcesScriptSrc);
		var coreScript = new AsyncScript("faq.core", coreScriptSrc, function () { $("#head").replaceWith(FAQRS.PageTitle); });

		var angularAppScript = new AsyncScript("faq.angular.app", angularAppSrc);

		angularAppScript.registerDependency([coreScript]);
		coreScript.registerDependency([resourcesScript]);
		coreScript.registerDependencyByName(["sp.js", "sp.runtime.js", "sp.init.js"]);

		angularAppScript.load();
	}
})(jQuery);

// Set the style of the app part page to be consistent with the host web.
// Get the URL of the host web and load the styling of it.
(function () {
	var hostUrl = "";
	if (document.URL.indexOf("?") != -1) {
		var params = document.URL.split("?")[1].split("&");
		for (var i = 0; i < params.length; i++) {
			p = decodeURIComponent(params[i]);
			if (/^SPHostUrl=/i.test(p)) {
				hostUrl = p.split("=")[1];
				document.write("<link rel=\"stylesheet\" href=\"" + hostUrl +
					"/_layouts/15/defaultcss.ashx\" />");
				break;
			}
		}
	}
	// if no host web URL was available, load the default styling
	if (hostUrl == "") {
		document.write("<link rel=\"stylesheet\" " +
			"href=\"/_layouts/15/1033/styles/themable/corev15.css\" />");
	}
})();

(function ($) {
	$.fn.SPEditable = function () {
		return this.each(function () {
			$(this).addClass("ms-rte-layoutszone-inner-editable ms-rtestate-write").attr("role", "textbox").attr("aria-haspopup", "true").attr("contentEditable", "true").attr("aria-autocomplete", "both").attr("aria-autocomplete", "both").attr("aria-multiline", "true");
		});
	};
	$.fn.SPNonEditable = function () {
		return this.each(function () {
			$(this).removeClass("ms-rte-layoutszone-inner-editable ms-rtestate-write").removeAttr("role aria-haspopup contentEditable aria-autocomplete aria-multiline");
		});
	};
	$("#richedit").SPEditable();
})(jQuery);