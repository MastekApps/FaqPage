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