<%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<!DOCTYPE html>
<html>
<head>
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
			angular.bootstrap(jQuery("#ng-app-FaqApp")[0], ["ViewFaqApp"]);
		});
	</script>
</head>
<body>
	<div id="ng-app-FaqApp" data-ng-controller="LicensingCtrl" data-block="lockDeferred">
		<div class="ng-hide bg-danger license-info text-danger" data-ng-show="trialExpired || licenseNotValid">
			<div class="ng-hide license-line" data-ng-show="trialExpired">{{Resources.TrialExpired}}</div>
			<div class="ng-hide license-line" data-ng-show="licenseNotValid">{{Resources.LicenseNotValid}}</div>
			<div class="license-line">
				<button type="button" data-ng-click="navigateToBuy()" class="btn btn-info">{{Resources.BuyFullVersion}}</button>
			</div>
		</div>
		<div data-ng-if="underTrial || licensed">
			<ng-view></ng-view>
		</div>
	</div>
</body>
</html>
