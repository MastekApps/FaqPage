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
	<script type="text/javascript" src="Scripts/init.js?v=2"></script>

	<link rel="Stylesheet" type="text/css" href="Content/css/faq.app.css?v=2" />

	<script type="text/javascript">
		jQuery(document).on("onAppLoaded", function () {
			angular.bootstrap(jQuery("#ng-app-FaqApp")[0], ["EditFaqApp"]);
		});
	</script>

</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
	<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

	<div id="ng-app-FaqApp" data-ng-controller="LicensingCtrl" data-block="lockDeferred">
		
		<div class="ng-hide bg-danger license-info text-danger" data-ng-show="trialExpired || underTrial || licenseNotValid">
			<div class="ng-hide license-line" data-ng-show="underTrial">{{Resources.TrialExpiringIn}} {{daysLeft}} {{Resources.Days}}</div>
			<div class="ng-hide license-line" data-ng-show="trialExpired">{{Resources.TrialExpired}}</div>
			<div class="ng-hide license-line" data-ng-show="licenseNotValid">{{Resources.LicenseNotValid}}</div>
			<div class="license-line">{{Resources.Please}} <button type="button" data-ng-click="go('/Licensing')" class="btn btn-info">{{Resources.ActivateApp}}</button> </div>
		</div>

		<div data-ng-if="showIfLicenseValid()">
			<toast></toast>
			<ng-form name="faqForm">
				<ng-view></ng-view>
			</ng-form>
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
