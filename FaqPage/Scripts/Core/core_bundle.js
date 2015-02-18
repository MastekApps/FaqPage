///#source 1 1 /Scripts/Core/Constants.js
"use strict";

Type.registerNamespace("FAQ.Fields.FaqList");
Type.registerNamespace("FAQ.Fields.AppPartsConfig");
Type.registerNamespace("FAQ.Lists");
Type.registerNamespace("FAQ.ErrorCodes");
Type.registerNamespace("FAQ.ContentTypes");

FAQ.ErrorCodes.FolderAlreadyExists = -2130245363;
FAQ.ErrorCodes.IllegalName = -2130575245;

FAQ.Lists.FaqUrl = "Lists/Faq";
FAQ.Lists.AppPartsConfigUrl = "Lists/AppPartsConfig";

FAQ.Fields.Modified = "Modified";
FAQ.Fields.Created = "Created";
FAQ.Fields.ModifiedBy = "Editor";
FAQ.Fields.CreatedBy = "Author";
FAQ.Fields.ID = "ID";
FAQ.Fields.FSObjType = "FSObjType";
FAQ.Fields.Title = "Title";
FAQ.Fields.FileLeafRef = "FileLeafRef";
FAQ.Fields.ContentTypeId = "ContentTypeId";
FAQ.Fields.FaqList.Question = "FAQQuestion";
FAQ.Fields.FaqList.Answer = "FAQAnswer";
FAQ.Fields.FaqList.Order = "FAQOrder";
FAQ.Fields.FaqList.Expanded = "FAQExpanded";
FAQ.Fields.FaqList.FolderSettings = "FAQFolderSettings";
FAQ.Fields.AppPartsConfig.AppPartId = "WebPartId";
FAQ.Fields.AppPartsConfig.Config = "WebPartConfig";

FAQ.ContentTypes.FaqFodlerId = "0x012000B611673586B24704B0EF576127543759";
///#source 1 1 /Scripts/Core/RequestError.js
function RequestError(error) {

    if (error instanceof SP.ClientRequestFailedEventArgs) {
        this.stackTrace = error.get_stackTrace();
        this.message = error.get_message();
        this.correlation = error.get_errorTraceCorrelationId();
        this.errorCode = error.get_errorCode();
        this.details = error.get_errorDetails();
        this.errorType = error.get_errorTypeName();
    } else if (typeof error == "string") {
        this.message = error;
    }
}

RequestError.registerClass("RequestError");
///#source 1 1 /Scripts/Core/ListService.js
FAQ.ListService =
(function () {
	"use strict";

	var loadListDeffered = $jq.Deferred();
	var context = SP.ClientContext.get_current();
	var lists = context.get_web().get_lists();
	context.load(lists, "Include(DefaultViewUrl)");
	context.executeQueryAsync(function () {
		loadListDeffered.resolve();
	}, function (sender, error) {
		debugger;
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
///#source 1 1 /Scripts/Core/Repositories/Base/ListRepository.js
function ListRepository(listUrl, listItemConstructor) {
	var e = Function.validateParameters(arguments, [
		{ name: "_listTitle", type: String },
		{ name: "listItemConstractor", type: Function }
	], true);

	if (e) throw e;

	this._listUrl = listUrl;
	this._listItemConstructor = listItemConstructor;

	this._context = SP.ClientContext.get_current();
	this._loadListDeffered = FAQ.ListService.getListByUrl(this._listUrl);
	this._loadListDeffered.done(Function.createDelegate(this, function (list) {
		this._list = list;
	}));

	this.folder = null;
}

ListRepository.prototype = {
	getItems: function () {
		return this._getItemsByQuery(SP.CamlQuery.createAllItemsQuery());
	},

	getItemById: function (id) {
		var e = Function.validateParameters(arguments, [
			{ name: "id", type: Number }
		], true);

		if (e) throw e;

		var deferred = this._createDeferred();

		this._loadListDeffered.done(Function.createDelegate(this, function () {
			var item = this._list.getItemById(id);
			this._context.load(item);

			var self = this;

			this._context.executeQueryAsync(function () {
				var resultItem = new self._listItemConstructor(item);
				deferred.resolve(resultItem);
			}, function (sender, error) {
				deferred.reject(new RequestError(error));
			});
		}));

		return deferred.promise;
	},

	getLastItem: function () {
		var camlBuilder = new CamlBuilder();
		var caml = camlBuilder.Where().CounterField(FAQ.Fields.ID).NotEqualTo(0).OrderByDesc(FAQ.Fields.ID).ToString();
		var query = new SP.CamlQuery();
		query.set_viewXml(String.format("<View>" +
											"<Query>{0}</Query>" +
											"<RowLimit>1</RowLimit>" +
										"</View>", caml));

		return this._getItemByQuery(query);
	},

	getRootFolders: function () {
		var deferred = this._createDeferred();

		this._loadListDeffered.done(Function.createDelegate(this, function () {

			var camlBuilder = new CamlBuilder();
			var caml = camlBuilder.Where()
				.IntegerField(FAQ.Fields.FSObjType).EqualTo(1).ToString();
			var camlQuery = new SP.CamlQuery();
			camlQuery.set_viewXml(String.format("<View>" +
												"<Query>{0}</Query>" +
											"</View>", caml));

			var items = this._list.getItems(camlQuery);
			var self = this;
			this._context.load(items);
			this._context.executeQueryAsync(function () {
				var folders = [];
				var itemsEnumerator = items.getEnumerator();
				while (itemsEnumerator.moveNext()) {
					var item = itemsEnumerator.get_current();

					//FIX for Item folder - default, can't figure out how to prevent its creation
					if (item.get_item(FAQ.Fields.Title) === "Item") continue;

					folders.push(new self._listItemConstructor(item));
				}

				deferred.resolve(folders);
			}, function (sender, error) {
				deferred.reject(new RequestError(error));
			});
		}));

		return deferred.promise;
	},

	saveItem: function (model) {
		var e = Function.validateParameters(arguments, [
			{ name: "model", type: this._listItemConstructor }
		], true);

		if (e) throw e;

		if (!model.id || model.id < 1) {
			return this._addItem(model);
		}

		return this._updateItem(model);
	},

	deleteItem: function (model) {
		var e = Function.validateParameters(arguments, [
			{ name: "model", type: this._listItemConstructor }
		], true);

		if (e) throw e;

		var deferred = this._createDeferred();

		this._loadListDeffered.done(Function.createDelegate(this, function () {
			var item = this._list.getItemById(model.id);
			this._context.load(item);

			item.deleteObject();

			this._context.executeQueryAsync(function () {
				deferred.resolve();
			}, function (sender, error) {
				deferred.reject(new RequestError(error));
			});
		}));

		return deferred.promise;
	},

	createFolder: function (folderName) {
		var e = Function.validateParameters(arguments, [
			{ name: "folderName", type: String }
		], true);

		if (e) throw e;

		var deferred = this._createDeferred();

		this._loadListDeffered.done(Function.createDelegate(this, function () {
			var folder = new SP.ListItemCreationInformation();
			folder.set_underlyingObjectType(SP.FileSystemObjectType.folder);
			folder.set_leafName(folderName);
			var folderItem = this._list.addItem(folder);
			folderItem.set_item("Title", folderName);
			folderItem.update();
			this._context.load(folderItem);
			this._context.executeQueryAsync(function () {
				deferred.resolve(folderItem);
			}, function (sender, error) {
				deferred.reject(new RequestError(error));
			});
		}));

		return deferred.promise;
	},

	_createDeferred: function () {
		return angular.injector(['ng']).get("$q").defer();
	},

	_addItem: function (model) {
		var e = Function.validateParameters(arguments, [
			{ name: "model", type: this._listItemConstructor }
		], true);

		if (e) throw e;

		var deferred = this._createDeferred();

		this._loadListDeffered.done(Function.createDelegate(this, function () {
			var itemCreateInfo = new SP.ListItemCreationInformation();
			if (this.folder) {
				itemCreateInfo.set_folderUrl(this._getFolderRelativeUrl());
			}
			var newItem = this._list.addItem(itemCreateInfo);

			this._setFieldValues(newItem, model);
			var self = this;

			newItem.update();
			this._context.load(newItem);

			this._context.executeQueryAsync(function () {
				var resultItem = new self._listItemConstructor(newItem);
				deferred.resolve(resultItem);
			}, function (sender, error) {
				deferred.reject(new RequestError(error));
			});
		}));

		return deferred.promise;
	},

	_updateItem: function (model) {
		var e = Function.validateParameters(arguments, [
			{ name: "model", type: this._listItemConstructor }
		], true);

		if (e) throw e;

		var deferred = this._createDeferred();

		this._loadListDeffered.done(Function.createDelegate(this, function () {
			var item = this._list.getItemById(model.id);
			this._context.load(item);

			this._setFieldValues(item, model);
			var self = this;

			item.update();

			this._context.executeQueryAsync(function () {
				var resultItem = new self._listItemConstructor(item);
				deferred.resolve(resultItem);
			}, function (sender, args) {
				deferred.reject(new RequestError(args));
			});
		}));

		return deferred.promise;
	},

	_setFieldValues: function (item, model) {
		item.set_item(FAQ.Fields.Title, model.title);
		if (model.fileLeafRef) {
			item.set_item(FAQ.Fields.FileLeafRef, model.fileLeafRef);
		}
	},

	_getFolderRelativeUrl: function () {
		var webRelativeUrl = _spPageContextInfo.webServerRelativeUrl.endsWith("/")
			? _spPageContextInfo.webServerRelativeUrl
			: _spPageContextInfo.webServerRelativeUrl + "/";

		return String.format("{0}{1}/{2}", webRelativeUrl, this._listUrl, this.folder);
	},

	_getItemsByQuery: function (camlQuery) {
		var e = Function.validateParameters(arguments, [
			{ name: "camlQuery", type: SP.CamlQuery }
		], true);

		if (e) throw e;

		var deferred = this._createDeferred();

		this._loadListDeffered.done(Function.createDelegate(this, function () {
			if (this.folder) {
				camlQuery.set_folderServerRelativeUrl(this._getFolderRelativeUrl());
			}
			var items = this._list.getItems(camlQuery);
			this._context.load(items);

			var self = this;

			this._context.executeQueryAsync(function () {
				var itemsEnumerator = items.getEnumerator();
				var resultItemList = [];

				while (itemsEnumerator.moveNext()) {
					resultItemList.push(new self._listItemConstructor(itemsEnumerator.get_current()));
				}
				deferred.resolve(resultItemList);

			}, function (sender, args) {
				deferred.reject(new RequestError(args));
			});
		}));

		return deferred.promise;
	},

	_getItemByQuery: function (camlQuery) {
		var e = Function.validateParameters(arguments, [
			{ name: "camlQuery", type: SP.CamlQuery }
		], true);

		if (e) throw e;

		var deferred = this._createDeferred();

		this._loadListDeffered.done(Function.createDelegate(this, function () {
			if (this.folder) {
				camlQuery.set_folderServerRelativeUrl(this._getFolderRelativeUrl());
			}
			var items = this._list.getItems(camlQuery);
			this._context.load(items);

			var self = this;

			this._context.executeQueryAsync(function () {
				var itemsEnumerator = items.getEnumerator();
				var resultItemList = [];

				while (itemsEnumerator.moveNext()) {
					resultItemList.push(new self._listItemConstructor(itemsEnumerator.get_current()));
				}
				if (resultItemList.length > 1) throw "Result contains more than one element";

				deferred.resolve(resultItemList.length === 1 ? resultItemList[0] : null);

			}, function (sender, args) {
				deferred.reject(new RequestError(args));
			});
		}));

		return deferred.promise;
	}
};

ListRepository.registerClass("ListRepository");
///#source 1 1 /Scripts/Core/Repositories/Base/BaseListItem.js
function BaseListItem(item) {
    var e = Function.validateParameters(arguments, [
		{ name: "item", type: SP.ListItem }
    ], true);

    if (e) throw e;

    this.item = item;
    this.id = item.get_id();
    this.created = item.get_item(FAQ.Fields.Created);
    this.createdBy = item.get_item(FAQ.Fields.CreatedBy);
    this.modified = item.get_item(FAQ.Fields.Modified);
    this.modifiedBy = item.get_item(FAQ.Fields.ModifiedBy);
    this.title = item.get_item(FAQ.Fields.Title);
}

BaseListItem.registerClass("BaseListItem");
///#source 1 1 /Scripts/Core/Repositories/FaqRepository.js
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
///#source 1 1 /Scripts/Core/Repositories/AppPartsConfigRepository.js
function AppPartsConfigRepository(listUrl) {
    AppPartsConfigRepository.initializeBase(this, [listUrl, AppPartConfigListItem]);
}

AppPartsConfigRepository.prototype = {
    _setFieldValues: function (item, model) {
        AppPartsConfigRepository.callBaseMethod(this, "_setFieldValues", [item, model]);

        item.set_item(FAQ.Fields.AppPartsConfig.AppPartId, model.wpId);

        item.set_item(FAQ.Fields.AppPartsConfig.Config, JSON.stringify(model.configData));
    },

    getByAppPartId: function (appPartId) {
        var camlBuilder = new CamlBuilder();
        var caml = camlBuilder.Where().TextField(FAQ.Fields.AppPartsConfig.AppPartId).EqualTo(appPartId).ToString();
        var query = new SP.CamlQuery();
        query.set_viewXml(String.format("<View>" +
											"<Query>{0}</Query>" +
										"</View>", caml));

        return this._getItemByQuery(query);
    },
};

AppPartsConfigRepository.registerClass("AppPartsConfigRepository", ListRepository);
///#source 1 1 /Scripts/Core/Repositories/Entities/FaqListItem.js
function FaqListItem(item) {
	if (item) {
		FaqListItem.initializeBase(this, [item]);

		this.question = item.get_item(FAQ.Fields.FaqList.Question);
		this.answer = item.get_item(FAQ.Fields.FaqList.Answer);
		this.order = item.get_item(FAQ.Fields.FaqList.Order);
		this.expanded = item.get_item(FAQ.Fields.FaqList.Expanded);

		var settings = item.get_item(FAQ.Fields.FaqList.FolderSettings);
		if (settings) {
			this.faqSetSettings = JSON.parse(settings);
		} else {
			this.faqSetSettings = {};
		}
	}
}

FaqListItem.registerClass("FaqListItem", BaseListItem);
///#source 1 1 /Scripts/Core/Repositories/Entities/AppPartConfigListItem.js
function AppPartConfigListItem(item) {
    if (item) {
        AppPartConfigListItem.initializeBase(this, [item]);

        this.wpId = item.get_item(FAQ.Fields.AppPartsConfig.AppPartId);
        this.configData = JSON.parse(item.get_item(FAQ.Fields.AppPartsConfig.Config));
    }
}

AppPartConfigListItem.registerClass("AppPartConfigListItem", BaseListItem);
///#source 1 1 /Scripts/Core/Common/SPWebService.js
FAQ.SPWebService =
(function () {
	"use strict";

	function getQueryStringParameter(paramToRetrieve) {
		var params =
			document.URL.split("?")[1].split("&");
		var strParams = "";
		for (var i = 0; i < params.length; i = i + 1) {
			var singleParam = params[i].split("=");
			if (singleParam[0] == paramToRetrieve)
				return singleParam[1];
		}
	};

	return {
		getHostWebId: function() {
			var deferred = angular.injector(['ng']).get("$q").defer();

			var hostweburl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
			var currentContext = SP.ClientContext.get_current();
			var hostContext = new SP.AppContextSite(currentContext, hostweburl);
			var hostWeb = hostContext.get_web();
			currentContext.load(hostWeb);
			currentContext.executeQueryAsync(function () {
				deferred.resolve(hostWeb.get_id().toString());
			}, function (sender, error) {
				deferred.reject(new RequestError(error));
			});

			return deferred.promise;
		},

		webProperties: {
			get: function (key) {

				var deferred = angular.injector(['ng']).get("$q").defer();

				var ctx = new SP.ClientContext.get_current();
				var webProperties = ctx.get_web().get_allProperties();
				ctx.load(webProperties);

				ctx.executeQueryAsync(function () {
					deferred.resolve(webProperties.get_fieldValues()[key]);
				}, function (sender, error) {
					deferred.reject(new RequestError(error));
				});

				return deferred.promise;
			},
			set: function (key, value) {
				var deferred = angular.injector(['ng']).get("$q").defer();

				var ctx = new SP.ClientContext.get_current();
				var web = ctx.get_web();
				var webProperties = web.get_allProperties();
				ctx.load(webProperties);

				ctx.executeQueryAsync(function () {
					webProperties.set_item(key, value);
					web.update();
					ctx.executeQueryAsync(function () {
						deferred.resolve();
					}, function (sender, error) {
						deferred.reject(new RequestError(error));
					});
				}, function (sender, error) {
					deferred.reject(new RequestError(error));
				});

				return deferred.promise;
			}
		}
	};
})();
