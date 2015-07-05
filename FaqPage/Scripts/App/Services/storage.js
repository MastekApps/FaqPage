(function () {
	"use strict";

	angular.module("FaqApp.services").factory("storage", function () {
		return {
			save: function(key, data, expirationInMin) {
				var expirationMS = expirationInMin * 60 * 1000;

				var record = { value: JSON.stringify(data), timestamp: new Date().getTime() + expirationMS };
				var dataToStore = LZString.compressToUTF16(JSON.stringify(record));
				localStorage.setItem(key, dataToStore);

				return data;
			},
			load: function (key) {
				var jsonData = LZString.decompressFromUTF16(localStorage.getItem(key));
				if (!jsonData) {
					return false;
				}
				var record = JSON.parse(jsonData);
				
				return (new Date().getTime() < record.timestamp && JSON.parse(record.value));
			}
		}
	});
})();