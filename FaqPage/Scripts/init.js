(function ($) {
	"use strict";

	window.$jq = jQuery.noConflict();

	//FIX - script error in FireFox when using angular and Rich Text Editor
	if (window.browseris && (window.browseris.firefox || window.browseris.chrome)) {
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

	$(function() {
		load();
	});

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var JSLoader = function (pathToScript, successCallback) {
		var script = document.createElement("script");
		script.async = true;
		script.type = "text/javascript";
		script.src = pathToScript;
		var loaded = false;
		var succcessFunction = successCallback;
		this.load = function () {
			script.onload = script.onreadystatechange = function () {
				if ((script.readyState && script.readyState !== "complete" && script.readyState !== "loaded") || loaded) {
					return;
				}
				loaded = true;
				script.onload = script.onreadystatechange = null;

				if (succcessFunction && typeof succcessFunction === "function") {
					succcessFunction();
				}
			};
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(script, s);
		};
	};

	var registeredResources = ["en-us", "ru-ru"];

	function load() {
		var hash = window.faq_version;
		var webRelUrl = getParameterByName("SPAppWebUrl");

		if (!webRelUrl.endsWith("/")) {
			webRelUrl = webRelUrl + "/";
		}

		var currentUICulture = getParameterByName("SPLanguage");
		if (!currentUICulture || $.inArray(currentUICulture.toLowerCase(), registeredResources) === -1) {
			currentUICulture = "en-us";
		}

		var coreScriptSrc = String.format("{0}Scripts/build/faq.app.core.min.js?v={1}", webRelUrl, hash);
		var resourcesScriptSrc = String.format("{0}Scripts/Resources/Resources.{1}.js?v={2}", webRelUrl, currentUICulture.toLowerCase(), hash);
		var angularAppSrc = String.format("{0}Scripts/build/faq.app.min.js?v={1}", webRelUrl, hash);

		var resourcesLoader = new JSLoader(resourcesScriptSrc, function () {
			var coreLoader = new JSLoader(coreScriptSrc, function () {
				$("#head").replaceWith(FAQRS.PageTitle);
				var appLoader = new JSLoader(angularAppSrc, function() {
					jQuery(document).trigger("onAppLoaded");
				});
				appLoader.load();
			});
			coreLoader.load();
		});
		resourcesLoader.load();
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