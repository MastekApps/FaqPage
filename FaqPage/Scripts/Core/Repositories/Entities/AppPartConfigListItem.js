function AppPartConfigListItem(item) {
    if (item) {
        AppPartConfigListItem.initializeBase(this, [item]);

        this.wpId = item.get_item(FAQ.Fields.AppPartsConfig.AppPartId);
        this.configData = JSON.parse(item.get_item(FAQ.Fields.AppPartsConfig.Config));
    }
}

AppPartConfigListItem.registerClass("AppPartConfigListItem", BaseListItem);