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
FAQ.Fields.FileDirRef = "FileDirRef";
FAQ.Fields.ContentTypeId = "ContentTypeId";
FAQ.Fields.FaqList.Question = "FAQQuestion";
FAQ.Fields.FaqList.Answer = "FAQAnswer";
FAQ.Fields.FaqList.Order = "FAQOrder";
FAQ.Fields.FaqList.Expanded = "FAQExpanded";
FAQ.Fields.FaqList.FolderSettings = "FAQFolderSettings";
FAQ.Fields.AppPartsConfig.AppPartId = "WebPartId";
FAQ.Fields.AppPartsConfig.Config = "WebPartConfig";

FAQ.ContentTypes.FaqFodlerId = "0x012000B611673586B24704B0EF576127543759";