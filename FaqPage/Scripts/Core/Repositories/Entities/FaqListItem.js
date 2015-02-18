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