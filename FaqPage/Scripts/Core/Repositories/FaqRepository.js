function FaqRepository(listUrl) {
	FaqRepository.initializeBase(this, [listUrl, FaqListItem]);
}

FaqRepository.prototype = {
	_setFieldValues: function (item, model) {
		FaqRepository.callBaseMethod(this, "_setFieldValues", [item, model]);

		item.set_item(FAQ.Fields.FaqList.Question, model.question);
		item.set_item(FAQ.Fields.FaqList.Answer, model.answer);
		item.set_item(FAQ.Fields.FaqList.Order, model.order);
		item.set_item(FAQ.Fields.FaqList.Expanded, model.expanded);

		if (model.faqSetSettings) {
			item.set_item(FAQ.Fields.FaqList.FolderSettings, JSON.stringify(model.faqSetSettings));
		}
	},
	createFaqFolder: function (folderName, settings) {
		var deferred = this._createDeferred();
		var self = this;

		this.createFolder(folderName).then(function (folderItem) {
			folderItem.set_item(FAQ.Fields.FaqList.FolderSettings, JSON.stringify(settings));
			folderItem.update();
			self._context.load(folderItem);
			self._context.executeQueryAsync(function () {
				deferred.resolve(folderItem);
			}, function (sender, error) {
				deferred.reject(new RequestError(error));
			});
		}, function(error) {
			deferred.reject(error);
		});

		return deferred.promise;
	},
	getOrderedItems: function () {
		var camlBuilder = new CamlBuilder();
		var caml = camlBuilder.Where().CounterField(FAQ.Fields.ID).NotEqualTo(0).OrderBy(FAQ.Fields.FaqList.Order).ToString();
		var query = new SP.CamlQuery();
		query.set_viewXml(String.format("<View>" +
											"<Query>{0}</Query>" +
										"</View>", caml));

		return this._getItemsByQuery(query);
	},
	updateOrdering: function (faqItems) {
		var e = Function.validateParameters(arguments, [
				{ name: "faqItems", type: Array, elementType: FaqListItem }
		]);

		if (e) throw e;

		var ids = faqItems.map(function (item) {
			return item.id;
		});

		var camlBuilder = new CamlBuilder();
		var caml = camlBuilder.Where().CounterField(FAQ.Fields.ID).In(ids).ToString();
		var camlQuery = new SP.CamlQuery();
		camlQuery.set_viewXml(String.format("<View>" +
											"<Query>{0}</Query>" +
										"</View>", caml));

		var deferred = this._createDeferred();

		this._loadListDeffered.done(Function.createDelegate(this, function () {
			if (this.folder) {
				camlQuery.set_folderServerRelativeUrl(this._getFolderRelativeUrl());
			}
			var items = this._list.getItems(camlQuery);
			this._context.load(items);

			this._context.executeQueryAsync(Function.createDelegate(this, function () {
				var itemsEnumerator = items.getEnumerator();

				while (itemsEnumerator.moveNext()) {
					var dbItem = itemsEnumerator.get_current();
					var modelItem = findFaqItemById(dbItem.get_id());
					dbItem.set_item(FAQ.Fields.FaqList.Order, modelItem.order);
					dbItem.update();
				}

				this._context.executeQueryAsync(function () {
					deferred.resolve();
				}, function (sender, args) {
					deferred.reject(new RequestError(args));
				});
			}), function (sender, args) {
				deferred.reject(new RequestError(args));
			});
		}));

		function findFaqItemById(id) {
			var item = null;

			Array.forEach(faqItems, function (faqItem) {
				if (faqItem.id === id) {
					item = faqItem;
				}
			});
			return item;
		}

		return deferred.promise;
	}
};

FaqRepository.registerClass("FaqRepository", ListRepository);