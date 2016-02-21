<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
	<meta name="WebPartPageExpansion" content="full" />

	<SharePoint:ScriptLink Name="SP.UI.Dialog.js" runat="server" OnDemand="false" LoadAfterUI="true" Localizable="false" />

	<script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
	<script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
	<script type="text/javascript" src="/_layouts/15/sp.js"></script>
	<script type="text/javascript" src="/_layouts/15/sp.requestexecutor.js"></script>


	<script type="text/javascript" src="Scripts/build/faq.app.external.min.js"></script>
	<script type="text/javascript" src="Scripts/build/build_config.js"></script>
	<script type="text/javascript" src="Scripts/init.js?v=3"></script>

	<link rel="Stylesheet" type="text/css" href="Content/css/faq.app.css?v=2" />

	<script type="text/javascript">
		jQuery(document).on("onAppLoaded", function () {
			angular.bootstrap(jQuery("#ng-app-FaqApp")[0], ["EditFaqApp"]);
		});
	</script>

</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
	<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

	<div ng-cloak id="ng-app-FaqApp" ng-controller="RootCtrl">
		<div class="clearfix">
			<toast></toast>
			<ng-form name="faqForm">
				<ng-view></ng-view>
			</ng-form>
		</div>
		<div class="footer">
			<div id="faq-contact-dev" class="faq-footer center-block">{{Resources.NeedDev}} <a href ng-click="go('/ContactDev')">{{Resources.Contact}}</a> {{Resources.MeDirectly}}</div>
			<div id="faq-review" class="faq-footer center-block">{{Resources.AppUseful}} <a href data-ng-click="navigateToReview()">{{Resources.Review}}</a> {{Resources.It}}</div>
		</div>
	</div>

	<!-- Trick to make Rich Text Editor working -->
	<div style="display: none">
		<WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="full" Title="loc:full">
			<WebPartPages:XsltListViewWebPart runat="server" ListUrl="Lists/Faq" IsIncluded="True"
				NoDefaultStyle="TRUE" Title="XsltListView web part" PageType="PAGE_NORMALVIEW"
				Default="False" ViewContentTypeId="0x">
			</WebPartPages:XsltListViewWebPart>
		</WebPartPages:WebPartZone>
	</div>
</asp:Content>
