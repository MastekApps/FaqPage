<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
	<SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="false" LoadAfterUI="true" Localizable="false" />
	<SharePoint:ScriptLink Name="sp.runtime.js" runat="server" OnDemand="false" LoadAfterUI="true" Localizable="false" />
	<SharePoint:ScriptLink Name="SP.RequestExecutor.js" runat="server" OnDemand="false" LoadAfterUI="true" Localizable="false" />

	<script type="text/javascript" src="Scripts/External/faq.app.external.min.js"></script>
	<script type="text/javascript" src="Scripts/build/build_config.js"></script>
	<script type="text/javascript" src="Scripts/init.js?v=2"></script>

	<link rel="Stylesheet" type="text/css" href="Content/css/css_bundle.css?v=2" />

	<style type="text/css">
		#s4-ribbonrow {
			display: none;
		}

		div#s4-workspace {
			overflow: hidden;
		}
	</style>

	<script type="text/javascript">
		ExecuteOrDelayUntilScriptLoaded(function () {
			angular.bootstrap(jQuery("#ng-app-FaqApp")[0], ["ViewFaqApp"]);
		}, "faq.angular.app");
	</script>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
	<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />
	<div id="ng-app-FaqApp" data-ng-controller="LicensingCtrl" data-block="lockDeferred">
		<div class="ng-hide bg-danger license-info text-danger" data-ng-show="trialExpired || licenseNotValid">
			<div class="ng-hide license-line" data-ng-show="trialExpired">{{Resources.TrialExpired}}</div>
			<div class="ng-hide license-line" data-ng-show="licenseNotValid">{{Resources.LicenseNotValid}}</div>
			<div class="license-line">{{Resources.Please}}
				<button type="button" data-ng-show="!isAppPart" data-ng-click="go('/Licensing')" class="btn btn-info">{{Resources.ActivateApp}}</button>
				<span data-ng-show="isAppPart">{{Resources.GoToLicense}}</span>
			</div>
		</div>
		<div data-ng-if="underTrial || licensed">
			<ng-view></ng-view>
		</div>
	</div>

</asp:Content>
