(function () {
	"use strict";

	angular.module("FaqApp.services").factory("storage", function () {
		return {
			save: function(key, data, expirationInMin) {
				var expirationMS = expirationInMin * 60 * 1000;

				var record = { value: JSON.stringify(data), timestamp: new Date().getTime() + expirationMS }
				localStorage.setItem(key, JSON.stringify(record));

				return data;
			},
			load: function(key) {
				var record = JSON.parse(localStorage.getItem(key));

				if (!record) {
					 return false;
				}
				
				return (new Date().getTime() < record.timestamp && JSON.parse(record.value));
			}
		}
	});
})();