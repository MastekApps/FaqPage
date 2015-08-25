FAQ.ListService =
(function () {
	"use strict";

	var loadListDeffered = $jq.Deferred();
	var context = SP.ClientContext.get_current();
	var lists = context.get_web().get_lists();
	context.load(lists, "Include(DefaultViewUrl,RootFolder)");
	context.executeQueryAsync(function () {
		loadListDeffered.resolve();
	}, function (sender, error) {
		loadListDeffered.reject(new RequestError(error));
		alert(String.fromat(FAQRS.ErrorLoadingList));
	});

	return {
		getListByUrl: function (listUrl) {
			var def = $jq.Deferred();

			loadListDeffered.done(function () {
				var enumerator = lists.getEnumerator();
				while (enumerator.moveNext()) {
					var list = enumerator.get_current();
					if (list.get_defaultViewUrl().indexOf(listUrl) != -1) {
						def.resolve(list);
						return;
					}
				}
			});
			return def.promise();
		}
	};
})();